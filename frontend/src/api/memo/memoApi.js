import apiFetch from "../apiFetch.js";

export async function fetchMemos() {
    const response = await apiFetch('/api/memos')

    if (!response.ok) {
        throw new Error(
            `메모 조회 실패: ${response.status}`,
        )
    }

    return response.json()
}

export async function createMemoRequest({
    folderId, title, content,
    }) {
    const response = await apiFetch(
        '/api/memos',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                folderId,
                title,
                content,
            }),
        },
    )

    if (!response.ok) {
        throw new Error(
            `메모 생성 실패: ${response.status}`,
        )
    }

    return response.json()
}

export async function updateMemoRequest(
    memoId,
    {title, content,},
){
    const response = await apiFetch(
        `/api/memos/${memoId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type':
                    'application/json',
            },
            body: JSON.stringify({
                title,
                content,
            }),
        },
    )

    if (!response.ok) {
        throw new Error(
            `메모 수정 실패: ${response.status}`,
        )
    }

    return response.json()

}

export async function deleteMemoRequest(memoId) {
    const response = await apiFetch(
        `/api/memos/${memoId}`,
        {
            method: 'DELETE',
        },
    )

    if (!response.ok) {
        throw new Error(
            `메모 삭제 실패: ${response.status}`,
        )
    }
}