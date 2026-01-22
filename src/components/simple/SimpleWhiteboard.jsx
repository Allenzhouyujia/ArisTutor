// 简单的白板组件 - 使用 Excalidraw（修复同步问题）
import { Excalidraw, MainMenu, WelcomeScreen } from "@excalidraw/excalidraw";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { supabase } from "../../lib/supabase";

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function SimpleWhiteboard({ roomId = "demo" }) {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const channelRef = useRef(null);
  const lastSentRef = useRef(null); // 记录最后发送的内容，避免重复
  const isReceivingRef = useRef(false); // 是否正在接收远程更新

  // 初始化 Supabase 频道
  useEffect(() => {
    if (!roomId) return;

    console.log('Setting up whiteboard channel:', roomId);

    const channel = supabase.channel(`wb-${roomId}`, {
      config: {
        broadcast: { self: false },
      },
    });

    channel
      .on('broadcast', { event: 'sync' }, (message) => {
        if (!excalidrawAPI || !message.payload?.elements) return;
        
        console.log('Received sync:', message.payload.elements.length, 'elements');
        
        // 标记正在接收
        isReceivingRef.current = true;
        
        try {
          // 获取当前场景
          const currentElements = excalidrawAPI.getSceneElements() || [];
          const incomingElements = message.payload.elements;
          
          // 合并策略：使用 Map 合并，保留最新的元素
          const elementMap = new Map();
          
          // 先添加当前元素
          currentElements.forEach(el => {
            elementMap.set(el.id, el);
          });
          
          // 用传入的元素覆盖（它们更新）
          incomingElements.forEach(el => {
            const existing = elementMap.get(el.id);
            // 如果元素不存在，或者传入的版本更新，则使用传入的
            if (!existing || (el.version && existing.version && el.version > existing.version)) {
              elementMap.set(el.id, el);
            } else if (!existing) {
              elementMap.set(el.id, el);
            }
          });
          
          const mergedElements = Array.from(elementMap.values());
          
          // 更新场景
          excalidrawAPI.updateScene({
            elements: mergedElements,
          });
        } catch (err) {
          console.error('Error updating whiteboard:', err);
        }
        
        // 延迟重置接收标志
        setTimeout(() => {
          isReceivingRef.current = false;
        }, 200);
      })
      .subscribe((status) => {
        console.log('Whiteboard channel:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    return () => {
      console.log('Cleaning up whiteboard channel');
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId, excalidrawAPI]);

  // 发送更新（带防抖）
  const sendUpdate = useMemo(() => debounce((elements) => {
    if (!channelRef.current || !elements || elements.length === 0) return;
    if (isReceivingRef.current) return; // 正在接收时不发送
    
    // 创建简化的元素数组（只包含必要字段）
    const simplifiedElements = elements.map(el => ({
      ...el,
      // 确保有 version 字段
      version: el.version || 1,
    }));
    
    // 检查是否和上次发送的相同
    const currentHash = JSON.stringify(simplifiedElements.map(e => e.id + e.version).sort());
    if (currentHash === lastSentRef.current) return;
    lastSentRef.current = currentHash;
    
    console.log('Sending sync:', simplifiedElements.length, 'elements');
    
    channelRef.current.send({
      type: 'broadcast',
      event: 'sync',
      payload: { elements: simplifiedElements },
    }).catch(err => console.error('Send error:', err));
  }, 300), []);

  // 处理变化
  const handleChange = useCallback((elements, appState) => {
    if (!elements) return;
    sendUpdate(elements);
  }, [sendUpdate]);

  return (
    <div className="h-full w-full relative">
      {/* 状态指示器 */}
      <div className={`absolute top-2 right-2 z-10 px-3 py-1 rounded-full text-xs text-white flex items-center gap-1 ${
        isConnected ? 'bg-green-500' : 'bg-yellow-500'
      }`}>
        <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-white' : 'bg-yellow-200 animate-pulse'}`}></span>
        {isConnected ? '已同步' : '连接中...'}
      </div>
      
      <Excalidraw
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        theme="light"
        onChange={handleChange}
        initialData={{
          elements: [],
          appState: {
            viewBackgroundColor: "#ffffff",
          },
        }}
      >
        <WelcomeScreen>
          <WelcomeScreen.Hints.MenuHint>
            使用菜单栏访问更多选项
          </WelcomeScreen.Hints.MenuHint>
          <WelcomeScreen.Hints.ToolbarHint>
            选择工具开始绘图
          </WelcomeScreen.Hints.ToolbarHint>
        </WelcomeScreen>
        <MainMenu>
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.ToggleTheme />
        </MainMenu>
      </Excalidraw>
    </div>
  );
}
