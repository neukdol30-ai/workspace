export const initialFolders = [
    {
        id: 'all',
        name: 'ALL NOTES',
        isVirtual: true,
    },
    {
        id: 1,
        name: 'INBOX',
        isSystem: true,
    },
    {
        id: 2,
        name: 'IDEAS',
        isSystem: false,
    },
    {
        id: 3,
        name: 'PROJECTS',
        isSystem: false,
    },
]

export const initialNotes = [
    {
        id: 1,
        folderId: 1,
        title: '새 메모',
        content: '여기에 내용을 입력합니다.',
        createdAt: '2026-08-18T09:00:00+09:00',
        updatedAt: '2026-08-18T09:00:00+09:00',
    },
    {
        id: 2,
        folderId: 2,
        title: '아이디어',
        content: '',
        createdAt: '2026-08-18T09:10:00+09:00',
        updatedAt: '2026-08-18T09:10:00+09:00',
    },
]

export const initialBoardNodes = [
    {
        memoId: 1,
        x: 80,
        y: 80,
        stackOrder: 1,
    },
    {
        memoId: 2,
        x: 340,
        y: 240,
        stackOrder: 2,
    },
]

export const initialBoardEdges = []
