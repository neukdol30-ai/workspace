import apiFetch from "../apiFetch.js";

export async function fetchBoardNodes() {
    const response = await apiFetch('/api/board/nodes');

    if (!response.ok) {
        throw new Error(
            `보드 노드 조회 실패: ${response.status}`,
        )
    }
    return response.json()
}

export async function saveBoardNodeRequest(node) {
    const response = await apiFetch(
        `/api/board/nodes/${node.memoId}`,
    {
        method: 'PUT',
        headers : {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            x: node.x,
            y: node.y,
            stackOrder: node.stackOrder,
        }),
    })

    if (!response.ok) {
        throw new Error(
            `보드 노드 저장 실패: ${response.status}`
        )
    }

    return response.json()
}

export async function fetchBoardEdges() {
    const response = await apiFetch('/api/board/edges' )
    if (!response.ok) {
        throw new Error(
            `연결선 조회 실패: ${response.status}`,
        )
    }
    return response.json()
}

export async function createBoardEdgeRequest(edge) {
    const response = await apiFetch('/api/board/edges' ,{
        method: 'POST',
        headers : {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            folderId: edge.folderId,
            sourceMemoId: edge.sourceMemoId,
            targetMemoId: edge.targetMemoId,
            edgeType: edge.edgeType ?? 'RELATED',
        }),
    },)

    if (!response.ok) {
        throw new Error(
            `연결선 생성 실패: ${response.status}`,
        )
    }
    return response.json()
}

export async function deleteBoardEdgeRequest(edgeId) {
    const response = await apiFetch(`/api/board/edges/${edgeId}` ,{
        method: 'DELETE',
    })
    if (!response.ok) {
        throw new Error(
            `연결선 삭제 실패: ${response.status}`,
        )
    }
}