const GRID_START_X = 80
const GRID_START_Y = 80
const GRID_COLUMN_GAP = 260
const GRID_ROW_GAP = 200
const GRID_COLUMN_COUNT = 4

export function createMissingBoardNodes(
    memos,
    boardNodes,
) {
    const storedMemoIds = new Set(
        boardNodes.map(
            (node) => node.memoId,
        ),
    )

    const highestStackOrder =
        boardNodes.reduce(
            (highest, node) =>
                Math.max(
                    highest,
                    node.stackOrder ?? 0,
                ),
            0,
        )

    return memos
        .filter(
            (memo) =>
                !storedMemoIds.has(memo.id),
        )
        .map((memo, index) => {
            const placementIndex =
                boardNodes.length + index

            return {
                memoId: memo.id,

                x:
                    GRID_START_X +
                    (placementIndex %
                        GRID_COLUMN_COUNT) *
                    GRID_COLUMN_GAP,

                y:
                    GRID_START_Y +
                    Math.floor(
                        placementIndex /
                        GRID_COLUMN_COUNT,
                    ) *
                    GRID_ROW_GAP,

                stackOrder:
                    highestStackOrder +
                    index +
                    1,
            }
        })
}