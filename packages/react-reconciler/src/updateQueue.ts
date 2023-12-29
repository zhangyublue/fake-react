import { Action } from 'shared/ReactTypes';

export interface Update<State> {
	action: Action<State>;
}

export interface UpdateQueue<State> {
	shared: {
		pending: Update<State> | null;
	};
}

// 创建 update
export const createUpdate = <State>(action: Action<State>): Update<State> => {
	return {
		action
	};
};


// 创建初始化的 updateQueue
export const createUpdateQueue = <Action>(): UpdateQueue<Action> => {
	return {
		shared: {
			pending: null
		}
	};
};

// 将 update 放入 updateQueue
export const enqueueUpdate = <Action>(
	updateQueue: UpdateQueue<Action>,
	update: Update<Action>
) => {
	updateQueue.shared.pending = update;
};

// 消费 update
export const processUpdateQueue = <State>(
	baseState: State,
	pendingUpdate: Update<State> | null
): { memoizedState: State } => {

  // 初始化 result
  const result: ReturnType<typeof processUpdateQueue<State>> = {
    memoizedState: baseState
  }

  // 如果没有 update，直接返回 baseState
  if (pendingUpdate !== null) {
    const action = pendingUpdate.action;
    if (action instanceof Function) {

      // 处理 state 为函数的情况
      result.memoizedState = action(baseState);
    } else {

      // 处理 state 非函数的情况
      result.memoizedState = action;
    }
  }
  return result;
};
