export declare class TreeNode<K, V> {
    constructor(_key?: K, _value?: V);
    /**
     * @description Get the pre node.
     * @return TreeNode about the pre node.
     */
    pre(): TreeNode<K, V>;
    /**
     * @description Get the next node.
     * @return TreeNode about the next node.
     */
    next(): TreeNode<K, V>;
    /**
     * @description Rotate _left.
     * @return TreeNode about moved to original position after rotation.
     */
    rotateLeft(): TreeNode<K, V>;
    /**
     * @description Rotate _right.
     * @return TreeNode about moved to original position after rotation.
     */
    rotateRight(): TreeNode<K, V>;
}
export declare class TreeNodeEnableIndex<K, V> extends TreeNode<K, V> {
    /**
     * @description Rotate _left and do recount.
     * @return TreeNode about moved to original position after rotation.
     */
    rotateLeft(): TreeNodeEnableIndex<K, V>;
    /**
     * @description Rotate _right and do recount.
     * @return TreeNode about moved to original position after rotation.
     */
    rotateRight(): TreeNode<K, V>;
    recount(): void;
}
