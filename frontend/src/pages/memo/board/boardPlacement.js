export const CARD_CENTER_X = 110
export const CARD_CENTER_Y = 75

export const CREATE_CASCADE_GAP = 24
export const CREATE_CASCADE_COUNT = 7

export const BOARD_TOOLBAR_WIDTH = 40
export const MEMO_COMMAND_BAR_HEIGHT = 36

export function calculateCascadeBoardPosition({
                                                  viewportWidth,
                                                  viewportHeight,
                                                  offsetX = 0,
                                                  offsetY = 0,
                                                  scale = 1,
                                                  cascadeIndex = 0,
                                              }) {
    const normalizedCascadeIndex =
        cascadeIndex % CREATE_CASCADE_COUNT

    const centerWorldX =
        (viewportWidth / 2 - offsetX) /
        scale

    const centerWorldY =
        (viewportHeight / 2 - offsetY) /
        scale

    return {
        x:
            centerWorldX -
            CARD_CENTER_X +
            normalizedCascadeIndex *
            CREATE_CASCADE_GAP,

        y:
            centerWorldY -
            CARD_CENTER_Y +
            normalizedCascadeIndex *
            CREATE_CASCADE_GAP,
    }
}