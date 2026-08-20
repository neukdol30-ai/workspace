import {useEffect, useRef, useState, } from 'react'
import {
    initialFolders,
    initialBoardNodes,
    initialBoardEdges,
} from "../pages/memo/memoData.js"
import MemoContext from "./MemoContext.js"

function MemoProvider({ children }) {
    const [folders, setFolders] = useState(initialFolders)

    useEffect(() => {
        async function loadFolders() {
            try {
                const response = await fetch(
                    '/api/folders?userId=1',
                )

                if (!response.ok) {
                    throw new Error(
                        `폴더 조회 실패: ${response.status}`,
                    )
                }

                const databaseFolders =
                    await response.json()

                setFolders([
                    {
                        id: 'all',
                        name: 'ALL NOTES',
                        isVirtual: true,
                    },
                    ...databaseFolders,
                ])
            } catch (error) {
                console.error(error)
            }
        }

        loadFolders()
    }, [])

    const [notes, setNotes] = useState([])

    const memoSaveTimersRef = useRef(new Map())

    const [selectedFolderId, setSelectedFolderId] =
    useState('all')

    const [selectedNoteId, setSelectedNoteId] =
        useState(null)

    const [boardNodes, setBoardNodes] =
    useState(initialBoardNodes)

    const [boardEdges, setBoardEdges] =
    useState(initialBoardEdges)

    const selectedNote =
        notes.find((note) => note.id === selectedNoteId) ?? null

    function selectFolder(folderId) {
        const nextVisibleNotes =
            folderId === 'all'
                ? notes
                : notes.filter(
                    (note) => note.folderId === folderId,
                )

        setSelectedFolderId(folderId)
        setSelectedNoteId(nextVisibleNotes[0]?.id ?? null)
    }

    async function createFolder(name) {
        const trimmedName = name.trim()

        if (!trimmedName) {
            return
        }

        const response = await fetch(
            '/api/folders?userId=1',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: trimmedName,
                }),
            },
        )

        if (!response.ok) {
            throw new Error(
                `폴더 생성 실패: ${response.status}`,
            )
        }

        const createdFolder = await response.json()

        setFolders((currentFolders) => [
            ...currentFolders,
            createdFolder,
        ])

        setSelectedFolderId(createdFolder.id)
        setSelectedNoteId(null)
    }

    useEffect(() => {
        async function loadMemos() {
            try {
                const response = await fetch(
                    '/api/memos?userId=1',
                )

                if (!response.ok) {
                    throw new Error(
                        `메모 조회 실패: ${response.status}`,
                    )
                }

                const databaseMemos =
                    await response.json()

                setNotes(databaseMemos)

                setSelectedNoteId(
                    databaseMemos[0]?.id ?? null,
                )
            } catch (error) {
                console.error(error)
            }
        }

        loadMemos()
    }, [])

    useEffect(() => {
        return () => {
            memoSaveTimersRef.current.forEach(
                (timerId) => clearTimeout(timerId),
            )

            memoSaveTimersRef.current.clear()
        }
    }, [])

    async function createNote(options = {}) {
        const requestedBoardPosition =
            options?.boardPosition

        const hasRequestedBoardPosition =
            Number.isFinite(requestedBoardPosition?.x) &&
            Number.isFinite(requestedBoardPosition?.y)

        const targetFolder =
            selectedFolderId === 'all'
                ? folders.find(
                    (folder) => folder.system,
                )
                : folders.find(
                    (folder) =>
                        folder.id === selectedFolderId,
                )

        if (!targetFolder || targetFolder.isVirtual) {
            return null
        }

        try {
            const response = await fetch(
                '/api/memos?userId=1',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        folderId: targetFolder.id,
                        title: '새 메모',
                        content: '',
                    }),
                },
            )

            if (!response.ok) {
                throw new Error(
                    `메모 생성 실패: ${response.status}`,
                )
            }

            const createdNote = await response.json()

            setNotes((currentNotes) => [
                createdNote,
                ...currentNotes,
            ])

            setSelectedNoteId(createdNote.id)

            setBoardNodes((currentNodes) => {
                const index = currentNodes.length

                const fallbackX =
                    80 + (index % 4) * 260

                const fallbackY =
                    80 +
                    Math.floor(index / 4) * 200

                const nextStackOrder =
                    currentNodes.reduce(
                        (highest, node) =>
                            Math.max(
                                highest,
                                node.stackOrder ?? 0,
                            ),
                        0,
                    ) + 1

                return [
                    ...currentNodes,
                    {
                        memoId: createdNote.id,

                        x: hasRequestedBoardPosition
                            ? requestedBoardPosition.x
                            : fallbackX,

                        y: hasRequestedBoardPosition
                            ? requestedBoardPosition.y
                            : fallbackY,

                        stackOrder: nextStackOrder,
                    },
                ]
            })

            return createdNote
        } catch (error) {
            console.error(error)
            window.alert('메모 생성에 실패했습니다.')
            return null
        }
    }

    async function deleteFolder(folderId) {
        const response = await fetch(
            `/api/folders/${folderId}?userId=1`,
            {
                method: 'DELETE',
            },
        )

        if (!response.ok) {
            throw new Error(
                `폴더 삭제 실패: ${response.status}`,
            )
        }

        const deletedNoteIds = new Set(
            notes
                .filter((note) => note.folderId === folderId)
                .map((note) => note.id),
        )

        const remainingNotes = notes.filter(
            (note) => note.folderId !== folderId,
        )

        setFolders((currentFolders) =>
            currentFolders.filter(
                (folder) => folder.id !== folderId,
            ),
        )

        setNotes(remainingNotes)

        setBoardNodes((currentNodes) =>
            currentNodes.filter(
                (node) => !deletedNoteIds.has(node.memoId),
            ),
        )

        setBoardEdges((currentEdges) =>
            currentEdges.filter(
                (edge) => edge.folderId !== folderId,
            ),
        )

        if (selectedFolderId === folderId) {
            setSelectedFolderId('all')
            setSelectedNoteId(
                remainingNotes[0]?.id ?? null,
            )
        }
    }

    async function deleteNote(noteId) {

        try {
            const response = await fetch(
                `/api/memos/${noteId}?userId=1`,
                {
                    method: 'DELETE',
                },
            )

            if (!response.ok) {
                throw new Error(
                    `메모 삭제 실패: ${response.status}`,
                )
            }
        } catch (error) {
            console.error(error)
            window.alert('메모 삭제에 실패했습니다.')
            return false
        }

        const visibleNotesBeforeDeletion =
            selectedFolderId === 'all'
                ? notes
                : notes.filter(
                    (note) =>
                        note.folderId === selectedFolderId,
                )

        const deletedNoteIndex =
            visibleNotesBeforeDeletion.findIndex(
                (note) => note.id === noteId,
            )

        const remainingNotes = notes.filter(
            (note) => note.id !== noteId,
        )

        const remainingVisibleNotes =
            selectedFolderId === 'all'
                ? remainingNotes
                : remainingNotes.filter(
                    (note) =>
                        note.folderId === selectedFolderId,
                )

        setNotes(remainingNotes)

        setBoardNodes((currentNodes) =>
            currentNodes.filter(
                (node) => node.memoId !== noteId,
            ),
        )

        setBoardEdges((currentEdges) =>
            currentEdges.filter(
                (edge) =>
                    edge.sourceMemoId !== noteId &&
                    edge.targetMemoId !== noteId,
            ),
        )

        if (selectedNoteId !== noteId) {
            return true
        }

        const nextNoteIndex = Math.min(
            Math.max(deletedNoteIndex, 0),
            remainingVisibleNotes.length - 1,
        )

        setSelectedNoteId(
            remainingVisibleNotes[nextNoteIndex]?.id ?? null,
        )

        return true
    }

    function updateSelectedNote(field, value) {
        if (!selectedNote) {
            return
        }

        const memoId = selectedNote.id

        const nextNote = {
            ...selectedNote,
            [field]: value,
            updatedAt: new Date().toISOString(),
        }

        setNotes((currentNotes) =>
            currentNotes.map((note) =>
                note.id === memoId
                    ? nextNote
                    : note,
            ),
        )

        const previousTimerId =
            memoSaveTimersRef.current.get(memoId)

        if (previousTimerId) {
            clearTimeout(previousTimerId)
        }

        const timerId = setTimeout(
            async () => {
                try {
                    const response = await fetch(
                        `/api/memos/${memoId}?userId=1`,
                        {
                            method: 'PATCH',
                            headers: {
                                'Content-Type':
                                    'application/json',
                            },
                            body: JSON.stringify({
                                title: nextNote.title,
                                content: nextNote.content,
                            }),
                        },
                    )

                    if (!response.ok) {
                        throw new Error(
                            `메모 수정 실패: ${response.status}`,
                        )
                    }

                    const savedNote =
                        await response.json()

                    setNotes((currentNotes) =>
                        currentNotes.map((note) => {
                            if (note.id !== memoId) {
                                return note
                            }

                            const hasNewerInput =
                                note.title !== nextNote.title ||
                                note.content !== nextNote.content

                            return hasNewerInput
                                ? note
                                : savedNote
                        }),
                    )
                } catch (error) {
                    console.error(error)
                    window.alert(
                        '메모 자동 저장에 실패했습니다.',
                    )
                } finally {
                    if (
                        memoSaveTimersRef.current.get(
                            memoId,
                        ) === timerId
                    ) {
                        memoSaveTimersRef.current.delete(
                            memoId,
                        )
                    }
                }
            },
            600,
        )

        memoSaveTimersRef.current.set(
            memoId,
            timerId,
        )
    }

    const value = {
        folders,
        setFolders,
        notes,
        boardNodes,
        setBoardNodes,
        boardEdges,
        setBoardEdges,
        selectedFolderId,
        selectedNoteId,
        selectedNote,
        setSelectedNoteId,
        selectFolder,
        createFolder,
        deleteFolder,
        createNote,
        updateSelectedNote,
        deleteNote,
    }

    return (
        <MemoContext.Provider value={value}>
            {children}
        </MemoContext.Provider>
    )
}

export default MemoProvider