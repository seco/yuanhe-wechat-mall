/**
 * Decision tree
 *
 * @author Minix Li
 */

/**
 * DecisionTree constructor
 *
 * @param {object} context
 * @param {DecisionTreeNode} root
 */
var DecisionTree = function(context, root) {
  this.context = context;
  this.root = root;
};

/**
 * Start decisions
 *
 * @param {Function} cb
 */
DecisionTree.prototype.startDecisions = function(cb) {

};

/**
 * DecisionTreeNode constructor
 */
var DecisionTreeNode = function() {
  this.childNodes = [];
  this.beforeDecision = null;
};

/**
 * Add child to this node
 *
 * @param {DecisionTreeNode} node
 *
 * @public
 */
DecisionTreeNode.prototype.addChild = function(node) {
  this.childNodes.push(node);
};

// export DecisionTree and DecisionTreeNode
module.exports = {
  'DecisionTree': DecisionTree,
  'DecisionTreeNode': DecisionTreeNode
};
