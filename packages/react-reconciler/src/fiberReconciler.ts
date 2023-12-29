import { Container } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import { HostRoot } from './workTags';
import { UpdateQueue, createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue';
import { ReactElementType } from 'shared/ReactTypes';
import { scheduleUpdateOnFiber } from './workLoop';

export function createContainer(container: Container) {
  // 创建 hostRootFiber
  const hostRootFiber = new FiberNode(HostRoot, {}, null);
  // 创建 fiberRootNode
  // 这一步会将 hostRootFiber 挂载到 fiberRootNode.current 上
  // 将 hostRootFiber 的 stateNode 指向 fiberRootNode
  const root = new FiberRootNode(container, hostRootFiber);
  // hostRootFiber 创建 updateQueue
  hostRootFiber.updateQueue = createUpdateQueue();
  return root;
}
export function updateContainer(element: ReactElementType | null, root: FiberRootNode) {
  const hostRootFiber = root.current;
  // 创建 update
  const update = createUpdate<ReactElementType | null>(element);
  // 将 update 插入 updateQueue
  enqueueUpdate(hostRootFiber.updateQueue as UpdateQueue<ReactElementType | null>, update);
  scheduleUpdateOnFiber(hostRootFiber);
  return element;
}