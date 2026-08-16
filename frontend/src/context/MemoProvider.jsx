import { useState } from "react"
import {
    initialFolders,
    initialNotes,
    initialBoardNodes,
    initialBoardEdges,
} from "../pages/memo/memoData.js"
import MemoContext from "./MemoContext.js"

function MemoProvider({ children }) {
    const [folders] = useState(initialFolders)
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

    function createNote(options = {}) {
        const requestedBoardPosition = options?.boardPosition

        const hasRequestedBoardPosition =
            Number.isFinite(requestedBoardPosition?.x) &&
            Number.isFinite(requestedBoardPosition?.y)

        const folderId =
            selectedFolderId === 'all'
        ? 'inbox'
                : selectedFolderId

        const newNote = {
            id: Date.now(),
            folderId,
            title: '새 메모',
            content: '',
            updatedAt: '방금 전',
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

            return [
                ...currentNodes,
                {
                    id: `node-${newNote.id}`,
                    noteId: newNote.id,

                    x: hasRequestedBoardPosition
                        ? requestedBoardPosition.x
                        : fallbackX,

                    y: hasRequestedBoardPosition
                        ? requestedBoardPosition.y
                        : fallbackY,
                },
            ]
        })
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

        const deletedNodeIds = new Set(
            boardNodes
                .filter((node) => node.noteId === noteId)
                .map((node) => node.id),
        )

        setNotes(remainingNotes)

        setBoardNodes((currentNodes) =>
            currentNodes.filter(
                (node) => node.noteId !== noteId,
            ),
        )

        setBoardEdges((currentEdges) =>
            currentEdges.filter(
                (edge) =>
                    !deletedNodeIds.has(edge.sourceNodeId) &&
                    !deletedNodeIds.has(edge.targetNodeId),
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
                        updatedAt: '방금 전',
                    }
                    : note,
            ),
        )
    }

    const value = {
        folders,
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