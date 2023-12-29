import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './fiberFlags';
import { Container } from 'hostConfig';

export class FiberNode {
	tag: WorkTag;
	key: Key;
	// hostRootFiber 的 stateNode 指向 FiberRootNode
	stateNode: any;
	pendingProps: Props;
	type: any;

	return: FiberNode | null;
	child: FiberNode | null;
	sibling: FiberNode | null;
	index: number;
	ref: Ref;

	memoizedProps: Props | null;
	// 双缓存策略中需要处理的 fiber
	alternate: FiberNode | null;
	flags: Flags
	// 更新队列
	updateQueue: unknown;
	memoizedState: any;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		// 实例
		this.tag = tag;
		this.key = key;
		// HostComponent <div></div> div DOM节点
		this.stateNode = null;
		// FunctionComponent () => {}
		this.type = null;

		// 构成树结构
		// 指向父 fiberNode
		this.return = null;
		this.sibling = null;
		this.child = null;
		this.index = 0;

		this.ref = null;

		// 作为工作单元
		this.pendingProps = pendingProps;
		this.memoizedState = null;
		this.memoizedProps = null;
		this.alternate = null;
		this.updateQueue = null;
		
		// 副作用
		this.flags = NoFlags;
		
		
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (current: FiberNode, pendingProps: Props): FiberNode => {
	let workInProgress = current.alternate;
	if (workInProgress === null) {
		// 初始化的时候alternate为null
		workInProgress = new FiberNode(current.tag, pendingProps, current.key);
		workInProgress.type = current.type;
		workInProgress.stateNode = current.stateNode;
		workInProgress.alternate = current;
		current.alternate = workInProgress;
	} else {
		// 这里是更新的时候
		// 更新时已经有了alternate
		workInProgress.pendingProps = pendingProps;
		// 重置副作用标签，因为副作用可能是上次更新的残留
		workInProgress.flags = NoFlags;
		workInProgress.updateQueue = current.updateQueue;
		workInProgress.child = current.child;
		workInProgress.memoizedProps = current.memoizedProps;
		workInProgress.memoizedState = current.memoizedState;
	}
	return workInProgress;
}