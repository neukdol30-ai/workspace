import { useEffect, useState } from "react"
import {
    initialFolders,
    initialNotes,
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

    const [notes, setNotes] = useState(initialNotes)

    const [selectedFolderId, setSelectedFolderId] =
    useState('all')

    const [selectedNoteId, setSelectedNoteId] = useState(
        initialNotes[0]?.id ?? null,
    )

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

    function createNote(options = {}) {
        const requestedBoardPosition = options?.boardPosition

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
            return
        }

        const folderId = targetFolder.id
        const now = new Date().toISOString()

        const newNote = {
            id: Date.now(),
            folderId,
            title: '새 메모',
            content: '',
            createdAt: now,
            updatedAt: now,
        }

        setNotes((currentNotes) => [
            newNote,
            ...currentNotes,
        ])

        setSelectedNoteId(newNote.id)

        setBoardNodes((currentNodes) => {
            const index = currentNodes.length

            const fallbackX = 80 + (index % 4) * 260
            const fallbackY =
                80 + Math.floor(index / 4) * 200

            const nextStackOrder =
                currentNodes.reduce(
                    (highest, node) =>
                        Math.max(highest, node.stackOrder ?? 0),
                    0,
                ) + 1

            return [
                ...currentNodes,
                {
                    memoId: newNote.id,

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

    function deleteNote(noteId) {
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
            return
        }

        const nextNoteIndex = Math.min(
            Math.max(deletedNoteIndex, 0),
            remainingVisibleNotes.length - 1,
        )

        setSelectedNoteId(
            remainingVisibleNotes[nextNoteIndex]?.id ?? null,
        )
    }

    function updateSelectedNote(field, value) {
        setNotes((currentNotes) =>
            currentNotes.map((note) =>
                note.id === selectedNoteId
                    ? {
                        ...note,
                        [field]: value,
                        updatedAt: new Date().toISOString(),
                    }
                    : note,
            ),
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