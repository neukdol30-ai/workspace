import apiFetch from "../apiFetch.js";

export async function fetchFolders(){
    const response = await apiFetch(
        '/api/folders',
    )

    if (!response.ok) {
        throw new Error(
            `폴더 조회 실패: ${response.status}`,
        )
    }

    return response.json()
}

export async function createFolderRequest(name) {
    const response = await apiFetch(
        '/api/folders',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name }),
        },
    )

    if (!response.ok) {
        throw new Error(
            `폴더 생성 실패: ${response.status}`,
        )
    }

    return response.json()
}

export async function deleteFolderRequest(folderId) {
    const response = await apiFetch(
        `/api/folders/${folderId}`,
        {
            method: 'DELETE',
        },
    )

    if (!response.ok) {
        throw new Error(
            `폴더 삭제 실패: ${response.status}`,
        )
    }
}