import { useEffect, useState } from 'react'
import { initialFolders } from '../pages/memo/memoData.js'
import { createFolderRequest, deleteFolderRequest, fetchFolders } from "../api/memo/folderApi.js";
import { createMemoRequest, deleteMemoRequest, fetchMemos } from "../api/memo/memoApi.js";
import { createBoardEdgeRequest,
         deleteBoardEdgeRequest,
         fetchBoardEdges,
         fetchBoardNodes,
         saveBoardNodeRequest } from "../api/memo/boardApi.js";
import { createMissingBoardNodes } from "../utils/memoBoardNodes.js";
import MemoContext from "./MemoContext.js"
import useMemoAutoSave from "../hooks/useMemoAutoSave.js";

function MemoProvider({ children }) {
    const [folders, setFolders] = useState(initialFolders)

    useEffect(() => {
        async function loadFolders() {
            try {


                const databaseFolders =
                    await fetchFolders()

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

    const { clearMemoSaveTimer, scheduleMemoSave } =
    useMemoAutoSave(setNotes)

    const [selectedFolderId, setSelectedFolderId] =
    useState('all')

    const [selectedNoteId, setSelectedNoteId] =
        useState(null)

    const [boardNodes, setBoardNodes] =
        useState([])

    const [boardEdges, setBoardEdges] =
        useState([])

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



        const createdFolder = await createFolderRequest(trimmedName)

        setFolders((currentFolders) => [
            ...currentFolders,
            createdFolder,
        ])

        setSelectedFolderId(createdFolder.id)
        setSelectedNoteId(null)
    }

    useEffect(() => {
        async function loadMemoWorkspace() {
            try {
                const [
                    databaseMemos,
                    databaseNodes,
                ] = await Promise.all([
                    fetchMemos(),
                    fetchBoardNodes(),
                ])

                const missingNodes =
                    createMissingBoardNodes(
                        databaseMemos,
                        databaseNodes,
                    )

                setNotes(databaseMemos)

                setBoardNodes([
                    ...databaseNodes,
                    ...missingNodes,
                ])

                setSelectedNoteId(
                    databaseMemos[0]?.id ?? null,
                )

                let hasNodeSaveFailure = false

                for (const missingNode of missingNodes) {
                    try {
                        const savedNode =
                            await saveBoardNodeRequest(
                                missingNode,
                            )

                        setBoardNodes((currentNodes) =>
                            currentNodes.map((node) =>
                                node.memoId ===
                                savedNode.memoId
                                    ? savedNode
                                    : node,
                            ),
                        )
                    } catch (error) {
                        console.error(error)
                        hasNodeSaveFailure = true
                    }
                }

                if (hasNodeSaveFailure) {
                    window.alert(
                        '일부 보드 위치 저장에 실패했습니다.',
                    )
                }
            } catch (error) {
                console.error(error)
                window.alert(
                    '메모 작업공간을 불러오지 못했습니다.',
                )
            }
        }

        loadMemoWorkspace()
    }, [])

    useEffect(() => {
        async function loadBoardEdges() {
            try {
                const databaseEdges =
                    await fetchBoardEdges()

                setBoardEdges(databaseEdges)
            } catch (error) {
                console.error(error)

                window.alert(
                    '보드 연결선을 불러오지 못했습니다.',
                )
            }
        }

        loadBoardEdges()
    }, [])

    async function saveBoardNode(node) {
        try {
            const savedNode =
                await saveBoardNodeRequest(node)

            setBoardNodes((currentNodes) => {
                const nodeExists = currentNodes.some(
                    (currentNode) =>
                        currentNode.memoId ===
                        savedNode.memoId,
                )

                if (!nodeExists) {
                    return [
                        ...currentNodes,
                        savedNode,
                    ]
                }

                return currentNodes.map(
                    (currentNode) =>
                        currentNode.memoId ===
                        savedNode.memoId
                            ? savedNode
                            : currentNode,
                )
            })

            return savedNode
        } catch (error) {
            console.error(error)

            window.alert(
                '보드 위치 저장에 실패했습니다.',
            )

            return null
        }
    }

    async function createBoardEdge(edge) {
        if (!Number.isFinite(edge.folderId)) {
            window.alert(
                'ALL NOTES에서는 연결선을 만들 수 없습니다.',
            )

            return null
        }

        try {
            const savedEdge = await createBoardEdgeRequest(edge)

            setBoardEdges((currentEdges) => {
                const edgeExists =
                    currentEdges.some(
                        (currentEdge) =>
                            currentEdge.id ===
                            savedEdge.id,
                    )

                if (edgeExists) {
                    return currentEdges
                }

                return [
                    ...currentEdges,
                    savedEdge,
                ]
            })

            return savedEdge
        } catch (error) {
            console.error(error)

            window.alert(
                '연결선 생성에 실패했습니다.',
            )

            return null
        }
    }

    async function deleteBoardEdge(edgeId) {
        try {
            await deleteBoardEdgeRequest(edgeId)

            setBoardEdges((currentEdges) =>
                currentEdges.filter(
                    (edge) => edge.id !== edgeId,
                ),
            )

            return true
        } catch (error) {
            console.error(error)

            window.alert(
                '연결선 삭제에 실패했습니다.',
            )

            return false
        }
    }

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

            const createdNote =
                await createMemoRequest({
                    folderId: targetFolder.id,
                    title: '새 메모',
                    content: '',
                })

            setNotes((currentNotes) => [
                createdNote,
                ...currentNotes,
            ])

            setSelectedNoteId(createdNote.id)

            const nodeIndex = boardNodes.length

            const fallbackX =
                80 + (nodeIndex % 4) * 260

            const fallbackY =
                80 +
                Math.floor(nodeIndex / 4) * 200

            const nextStackOrder =
                boardNodes.reduce(
                    (highest, node) =>
                        Math.max(
                            highest,
                            node.stackOrder ?? 0,
                        ),
                    0,
                ) + 1

            const createdNode = {
                memoId: createdNote.id,

                x: hasRequestedBoardPosition
                    ? requestedBoardPosition.x
                    : fallbackX,

                y: hasRequestedBoardPosition
                    ? requestedBoardPosition.y
                    : fallbackY,

                stackOrder: nextStackOrder,
            }

            setBoardNodes((currentNodes) => [
                ...currentNodes,
                createdNode,
            ])

            try {
                const savedNode =
                    await saveBoardNodeRequest(createdNode)

                setBoardNodes((currentNodes) =>
                    currentNodes.map((node) =>
                        node.memoId === savedNode.memoId
                            ? savedNode
                            : node,
                    ),
                )
            } catch (nodeError) {
                console.error(nodeError)

                window.alert(
                    '메모는 생성됐지만 보드 위치 저장에 실패했습니다.',
                )
            }

            return createdNote

        } catch (error) {
            console.error(error)
            window.alert('메모 생성에 실패했습니다.')
            return null
        }
    }

    async function deleteFolder(folderId) {
        const deletedNoteIds = new Set(
            notes
                .filter(
                    (note) => note.folderId === folderId,
                )
                .map((note) => note.id),
        )

        await deleteFolderRequest(folderId)

        deletedNoteIds.forEach(
            (memoId) => clearMemoSaveTimer(memoId),
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
        clearMemoSaveTimer(noteId)

        try {
            await deleteMemoRequest(noteId)
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
        scheduleMemoSave(nextNote)
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
        saveBoardNode,
        createBoardEdge,
        deleteBoardEdge,
    }

    return (
        <MemoContext.Provider value={value}>
            {children}
        </MemoContext.Provider>
    )
}

export default MemoProvider