import { useEffect, useRef } from 'react'
import { updateMemoRequest } from '../api/memo/memoApi.js'

function useMemoAutoSave(setNotes) {
    const memoSaveTimersRef =
        useRef(new Map())

    useEffect(() => {
        const memoSaveTimers =
            memoSaveTimersRef.current

        return () => {
            memoSaveTimers.forEach(
                (timerId) => clearTimeout(timerId),
            )

            memoSaveTimers.clear()
        }
    }, [])

    function clearMemoSaveTimer(memoId) {
        const timerId =
            memoSaveTimersRef.current.get(memoId)

        if (timerId === undefined) {
            return
        }

        clearTimeout(timerId)
        memoSaveTimersRef.current.delete(memoId)
    }

    function scheduleMemoSave(nextNote) {
        const memoId = nextNote.id

        clearMemoSaveTimer(memoId)

        const timerId = setTimeout(
            async () => {
                try {
                    const savedNote =
                        await updateMemoRequest(
                            memoId,
                            {
                                title: nextNote.title,
                                content: nextNote.content,
                            },
                        )

                    setNotes((currentNotes) =>
                        currentNotes.map((note) => {
                            if (note.id !== memoId) {
                                return note
                            }

                            const hasNewerInput =
                                note.title !== nextNote.title ||
                                note.content !== nextNote.content

                            return hasNewerInput
                                ? note
                                : savedNote
                        }),
                    )
                } catch (error) {
                    console.error(error)
                    window.alert(
                        '메모 자동 저장에 실패했습니다.',
                    )
                } finally {
                    if (
                        memoSaveTimersRef.current.get(
                            memoId,
                        ) === timerId
                    ) {
                        memoSaveTimersRef.current.delete(
                            memoId,
                        )
                    }
                }
            },
            600,
        )

        memoSaveTimersRef.current.set(
            memoId,
            timerId,
        )
    }

    return {
        clearMemoSaveTimer,
        scheduleMemoSave,
    }
}

export default useMemoAutoSave