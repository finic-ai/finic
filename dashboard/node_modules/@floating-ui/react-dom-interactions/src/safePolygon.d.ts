import type { FloatingContext, FloatingTreeType, ReferenceType } from './types';
export declare function safePolygon<RT extends ReferenceType = ReferenceType>({ restMs, buffer, blockPointerEvents, debug, }?: Partial<{
    restMs: number;
    buffer: number;
    blockPointerEvents: boolean;
    debug: null | ((points?: string | null) => void);
}>): {
    ({ x, y, placement, refs, onClose, nodeId, tree, leave, }: FloatingContext<RT> & {
        onClose: () => void;
        tree?: FloatingTreeType<RT> | null | undefined;
        leave?: boolean | undefined;
    }): (event: PointerEvent) => void;
    __options: {
        blockPointerEvents: boolean;
    };
};
