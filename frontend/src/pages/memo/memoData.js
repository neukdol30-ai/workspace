export const initialFolders = [
    { id: 'all', name: 'ALL NOTES' },
    { id: 'inbox', name: 'INBOX' },
    { id: 'ideas', name: 'IDEAS' },
    { id: 'projects', name: 'PROJECTS' },
]

export const initialNotes = [
    {
        id: 1,
        folderId: 'inbox',
        title: '새 메모',
        content: '여기에 내용을 입력합니다.',
        updatedAt: '방금 전',
    },
    {
        id: 2,
        folderId: 'ideas',
        title: '아이디어',
        content: '',
        updatedAt: '오늘',
    },
]

export const initialBoardNodes = [
    {
        id: 'node-1',
        noteId: 1,
        x: 80,
        y: 80,
    },
    {
        id: 'node-2',
        noteId: 2,
        x: 340,
        y: 240,
    },
]

export const initialBoardEdges = []
