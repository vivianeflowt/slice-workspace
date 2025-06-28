import React, { useRef, useState, useCallback } from 'react';
import { FiMinus, FiX } from 'react-icons/fi';

interface WindowProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onMinimize?: () => void;
  onClose?: () => void;
  iconCircleColor?: string;
  iconCircleBorderColor?: string;
  iconCircleBorderSize?: number;
  iconColor?: string;
  iconSize?: number;
  iconCircleShadow?: string;
  titlebarColor?: string;
  titleFontSize?: number;
  controlButtonColor?: string;
  bodyColor?: string;
  bodyShadow?: string;
  bodyShadowColor?: string;
  bodyShadowOpacity?: number;
  initialX?: number;
  initialY?: number;
  center?: boolean;
  showMinimize?: boolean;
  showClose?: boolean;
}

const ICON_SIZE = 36;
const ICON_OFFSET = ICON_SIZE / 2;
const BORDER_COLOR = '#3a3a3a';
const fontStack = `'Fira Code', 'JetBrains Mono', 'Menlo', 'monospace'`;

const RESIZE_SIZE = 8;
const BORDER_RADIUS = 6;

const MIN_TITLE_WIDTH = 120;
const MIN_BUTTONS_WIDTH = 48;
const MIN_ICON_WIDTH = ICON_SIZE + 12;
const MIN_PADDING = 32;
const minWidth = MIN_ICON_WIDTH + MIN_TITLE_WIDTH + MIN_BUTTONS_WIDTH + MIN_PADDING;
const minHeight = 180;

function getRandomDistortion(subtle = false) {
  // Efeito mais sutil se subtle=true
  const scale = 1 + (Math.random() - 0.5) * (subtle ? 0.012 : 0.03); // 0.994 ~ 1.006 ou 0.985 ~ 1.015
  const skew = (Math.random() - 0.5) * (subtle ? 0.5 : 1.5); // -0.25 ~ 0.25 ou -0.75 ~ 0.75 deg
  const rotate = (Math.random() - 0.5) * (subtle ? 0.3 : 1.2); // -0.15 ~ 0.15 ou -0.6 ~ 0.6 deg
  return `scale(${scale}) skew(${skew}deg) rotate(${rotate}deg)`;
}

const Window: React.FC<WindowProps> = ({
  title,
  icon,
  children,
  onMinimize,
  onClose,
  iconCircleColor = '#262833',
  iconCircleBorderColor = '#4a4e5a',
  iconCircleBorderSize = 2.5,
  iconColor = '#f3f4f7',
  iconSize = 16,
  iconCircleShadow = '0 4px 16px 0 rgba(0,0,0,0.22), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
  titlebarColor = '#202127',
  titleFontSize = 13,
  controlButtonColor = '#bfc7d5',
  bodyColor = '#20222a',
  bodyShadow = '0 6px 28px 0 rgba(0,0,0,0.22), 0 1.5px 4px 0 rgba(0,0,0,0.10)',
  bodyShadowColor,
  bodyShadowOpacity,
  initialX = 150, // Desenvolvimento
  initialY = 150, // Desenvolvimento
  center = false,
  showMinimize = true,
  showClose = true,
}) => {
  const [resizeHover, setResizeHover] = useState<
    null | 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'bottom-right' | 'bottom-left'
  >(null);
  const [resizeEnabled, setResizeEnabled] = useState<
    null | 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'bottom-right' | 'bottom-left'
  >(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: typeof initialX === 'number' ? initialX : 0,
    y: typeof initialY === 'number' ? initialY : 0,
  });
  const [focused, setFocused] = useState(false);
  const [distortion, setDistortion] = useState<string>('');
  const [dragStart, setDragStart] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    edge: string;
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const lastDrag = useRef<{ x: number; y: number; t: number }>({ x: 0, y: 0, t: 0 });
  const [pressScale, setPressScale] = useState(1);
  const [scaleTransition, setScaleTransition] = useState(
    'transform 80ms cubic-bezier(.7,1.7,.7,1)',
  );

  // Microanimação ao receber foco
  const triggerDistortion = useCallback((subtle = false) => {
    const d = getRandomDistortion(subtle);
    setDistortion(d);
    setTimeout(() => setDistortion(''), 120);
  }, []);

  // Mouse move handler for resizing
  React.useEffect(() => {
    if (!resizeEnabled || !dragStart) return;
    const onMove = (e: MouseEvent) => {
      if (!windowRef.current) return;
      let dx = e.clientX - dragStart.x;
      let dy = e.clientY - dragStart.y;
      let newWidth = dragStart.width;
      let newHeight = dragStart.height;
      let newX = position.x;
      let newY = position.y;
      // Bordas
      if (resizeEnabled === 'right') {
        const candidateWidth = dragStart.width + dx;
        newWidth = Math.max(minWidth, candidateWidth);
      }
      if (resizeEnabled === 'left') {
        newWidth = Math.max(minWidth, dragStart.width - dx);
        newX =
          dragStart.x + dx < dragStart.x + dragStart.width - minWidth
            ? dragStart.x + dragStart.width - minWidth
            : dragStart.x + dx;
      }
      if (resizeEnabled === 'bottom') newHeight = Math.max(minHeight, dragStart.height + dy);
      if (resizeEnabled === 'top') {
        newHeight = Math.max(minHeight, dragStart.height - dy);
        newY =
          dragStart.y + dy < dragStart.y + dragStart.height - minHeight
            ? dragStart.y + dragStart.height - minHeight
            : dragStart.y + dy;
      }
      // Diagonais
      if (resizeEnabled === 'bottom-right') {
        newWidth = Math.max(minWidth, dragStart.width + dx);
        newHeight = Math.max(minHeight, dragStart.height + dy);
      }
      if (resizeEnabled === 'bottom-left') {
        const candidateWidth = dragStart.width - dx;
        newWidth = Math.max(minWidth, candidateWidth);
        if (candidateWidth > minWidth) {
          newX = dragStart.x + dx;
        } else {
          newX = dragStart.x + dragStart.width - minWidth;
        }
        newHeight = Math.max(minHeight, dragStart.height + dy);
      }
      if (resizeEnabled === 'top-right') {
        newWidth = Math.max(minWidth, dragStart.width + dx);
        newHeight = Math.max(minHeight, dragStart.height - dy);
        newY =
          dragStart.y + dy < dragStart.y + dragStart.height - minHeight
            ? dragStart.y + dragStart.height - minHeight
            : dragStart.y + dy;
      }
      setDimensions({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
    };
    const onUp = () => {
      setResizeEnabled(null);
      setDragStart(null);
      document.body.style.cursor = '';
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [resizeEnabled, dragStart, position.x, position.y]);

  // Cursor effect
  React.useEffect(() => {
    if (dragging) {
      document.body.style.cursor = 'grabbing';
    } else if (resizeEnabled) {
      document.body.style.cursor =
        resizeEnabled === 'left' || resizeEnabled === 'right' ? 'ew-resize' : 'ns-resize';
    } else if (resizeHover) {
      document.body.style.cursor =
        resizeHover === 'left' || resizeHover === 'right' ? 'ew-resize' : 'ns-resize';
    } else {
      document.body.style.cursor = '';
    }
    return () => {
      document.body.style.cursor = '';
    };
  }, [dragging, resizeHover, resizeEnabled]);

  // Handle hover with delay
  const handleResizeMouseEnter = (
    edge: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'bottom-right' | 'bottom-left',
  ) => {
    setResizeHover(edge);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };
  const handleResizeMouseLeave = () => {
    setResizeHover(null);
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
  };
  const handleResizeMouseDown = (
    edge: 'top' | 'bottom' | 'left' | 'right' | 'top-right' | 'bottom-right' | 'bottom-left',
    e: React.MouseEvent,
  ) => {
    if (resizeHover !== edge) return;
    if (!windowRef.current) return;
    setResizeEnabled(edge);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      width: windowRef.current.clientWidth,
      height: windowRef.current.clientHeight,
      edge,
    });
    e.preventDefault();
  };

  // Drag window
  const handleTitlebarMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setScaleTransition('transform 80ms cubic-bezier(.7,1.7,.7,1)');
    setPressScale(0.985);
    setTimeout(() => {
      setScaleTransition('transform 220ms cubic-bezier(.7,1.7,.7,1)');
      setPressScale(1);
    }, 80);
    setDragging(true);
    const rect = windowRef.current?.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0),
    };
    lastDrag.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    triggerDistortion(true); // Efeito ao iniciar arrasto
  };

  React.useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
      lastDrag.current = { x: e.clientX, y: e.clientY, t: Date.now() };
    };
    const onUp = (e: MouseEvent) => {
      setDragging(false);
      document.body.style.cursor = '';
      // Calcular velocidade e direção
      const now = Date.now();
      const dt = Math.max(now - lastDrag.current.t, 1);
      const dx = e.clientX - lastDrag.current.x;
      const dy = e.clientY - lastDrag.current.y;
      const vx = dx / dt; // px/ms
      const vy = dy / dt;
      // Limitar valores máximos
      const maxV = 0.7;
      const normVx = Math.max(-maxV, Math.min(maxV, vx));
      const normVy = Math.max(-maxV, Math.min(maxV, vy));
      // Distorção proporcional à velocidade e direção
      const scale = 1 + Math.abs(normVx + normVy) * 0.08;
      const skew = normVx * 2.5;
      const rotate = normVy * 2.5;
      setDistortion(`scale(${scale}) skew(${skew}deg) rotate(${rotate}deg)`);
      setTimeout(() => setDistortion(''), 120);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [dragging]);

  return (
    <div
      ref={windowRef}
      className="window"
      tabIndex={0}
      onFocus={() => {
        setFocused(true);
        triggerDistortion(true);
      }}
      onBlur={() => setFocused(false)}
      style={{
        boxShadow: '0 10px 40px 0 rgba(0,0,0,0.32), 0 2px 8px 0 rgba(0,0,0,0.18)',
        borderRadius: BORDER_RADIUS,
        background: '#191b22',
        border: `1.5px solid ${BORDER_COLOR}`,
        position: center ? 'absolute' : 'absolute',
        left: center ? '50%' : position.x,
        top: center ? '50%' : position.y,
        transform: center
          ? `translate(-50%, -50%) scale(${pressScale})${distortion ? ' ' + distortion : ''}`
          : `${distortion ? distortion : ''} scale(${pressScale})`,
        overflow: 'visible',
        minWidth: 320,
        minHeight: 180,
        maxWidth: 1100,
        aspectRatio: '16/9',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: fontStack,
        resize: 'none',
        width: dimensions?.width,
        height: dimensions?.height,
        transition: scaleTransition,
        zIndex: focused ? 100 : 1,
        userSelect: dragging ? 'none' : 'auto',
      }}
    >
      {/* Handles de resize nas bordas com delay para ativar cursor e resize */}
      {/* Top */}
      <div
        style={{
          position: 'absolute',
          top: -RESIZE_SIZE,
          left: RESIZE_SIZE,
          right: RESIZE_SIZE,
          height: RESIZE_SIZE,
          zIndex: 20,
          cursor: 'ns-resize',
        }}
        onMouseEnter={() => handleResizeMouseEnter('top')}
        onMouseLeave={handleResizeMouseLeave}
        onMouseDown={(e) => handleResizeMouseDown('top', e)}
      />
      {/* Bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: -RESIZE_SIZE,
          left: RESIZE_SIZE,
          right: RESIZE_SIZE,
          height: RESIZE_SIZE,
          zIndex: 20,
          cursor: 'ns-resize',
        }}
        onMouseEnter={() => handleResizeMouseEnter('bottom')}
        onMouseLeave={handleResizeMouseLeave}
        onMouseDown={(e) => handleResizeMouseDown('bottom', e)}
      />
      {/* Left */}
      <div
        style={{
          position: 'absolute',
          top: RESIZE_SIZE,
          bottom: RESIZE_SIZE,
          left: -RESIZE_SIZE,
          width: RESIZE_SIZE,
          zIndex: 20,
          cursor: 'ew-resize',
        }}
        onMouseEnter={() => handleResizeMouseEnter('left')}
        onMouseLeave={handleResizeMouseLeave}
        onMouseDown={(e) => handleResizeMouseDown('left', e)}
      />
      {/* Right */}
      <div
        style={{
          position: 'absolute',
          top: RESIZE_SIZE,
          bottom: RESIZE_SIZE,
          right: -RESIZE_SIZE,
          width: RESIZE_SIZE,
          zIndex: 20,
          cursor: 'ew-resize',
        }}
        onMouseEnter={() => handleResizeMouseEnter('right')}
        onMouseLeave={handleResizeMouseLeave}
        onMouseDown={(e) => handleResizeMouseDown('right', e)}
      />
      {/* Diagonais (exceto top-left) */}
      {/* Top-right */}
      <div
        style={{
          position: 'absolute',
          top: -RESIZE_SIZE,
          right: -RESIZE_SIZE,
          width: RESIZE_SIZE,
          height: RESIZE_SIZE,
          zIndex: 21,
          cursor: 'nesw-resize',
        }}
        onMouseEnter={() => handleResizeMouseEnter('top-right')}
        onMouseLeave={handleResizeMouseLeave}
        onMouseDown={(e) => handleResizeMouseDown('top-right', e)}
      />
      {/* Bottom-right */}
      <div
        style={{
          position: 'absolute',
          bottom: -RESIZE_SIZE,
          right: -RESIZE_SIZE,
          width: RESIZE_SIZE,
          height: RESIZE_SIZE,
          zIndex: 21,
          cursor: 'nwse-resize',
        }}
        onMouseEnter={() => handleResizeMouseEnter('bottom-right')}
        onMouseLeave={handleResizeMouseLeave}
        onMouseDown={(e) => handleResizeMouseDown('bottom-right', e)}
      />
      {/* Bottom-left */}
      <div
        style={{
          position: 'absolute',
          bottom: -RESIZE_SIZE,
          left: -RESIZE_SIZE,
          width: RESIZE_SIZE,
          height: RESIZE_SIZE,
          zIndex: 21,
          cursor: 'nesw-resize',
        }}
        onMouseEnter={() => handleResizeMouseEnter('bottom-left')}
        onMouseLeave={handleResizeMouseLeave}
        onMouseDown={(e) => handleResizeMouseDown('bottom-left', e)}
      />
      {/* Círculo do ícone sobrepondo a titlebar no canto esquerdo */}
      {icon && (
        <span
          className="window-icon"
          aria-hidden
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            borderRadius: '50%',
            background: iconCircleColor,
            border: `${iconCircleBorderSize}px solid ${iconCircleBorderColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left: -ICON_OFFSET + 6,
            top: -ICON_OFFSET / 2 + 3,
            zIndex: 31,
            boxShadow: iconCircleShadow,
            cursor: 'default',
          }}
        >
          {React.isValidElement(icon)
            ? React.cloneElement(icon as any, { color: iconColor, size: iconSize })
            : icon}
        </span>
      )}
      <div
        className="window-header"
        tabIndex={0}
        aria-label="Barra de título da janela"
        style={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          minHeight: 28,
          background: titlebarColor,
          borderTopLeftRadius: BORDER_RADIUS,
          borderTopRightRadius: BORDER_RADIUS,
          borderBottom: `1px solid #3a3a3a`,
          paddingLeft: ICON_SIZE / 2 - 8,
          paddingRight: ICON_SIZE / 2 + 16,
          zIndex: 30,
        }}
      >
        {/* Área central de drag */}
        <span
          className="window-drag-area"
          style={{
            flex: 1,
            textAlign: 'center',
            fontWeight: 600,
            fontSize: titleFontSize,
            letterSpacing: 0.2,
            zIndex: 1,
            position: 'relative',
            color: '#e3e6f0',
            userSelect: 'none',
            fontFamily: fontStack,
            cursor: dragging ? 'grabbing' : 'grab',
            marginLeft: ICON_SIZE / 2,
            marginRight: ICON_SIZE / 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseDown={(e) => {
            triggerDistortion();
            handleTitlebarMouseDown(e);
          }}
        >
          {title}
        </span>
        <div
          className="window-controls"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            position: 'absolute',
            right: 16,
            top: '60%',
            transform: 'translateY(-50%)',
            background: 'none',
            boxShadow: 'none',
          }}
        >
          {showMinimize && (
            <button
              className="btn-ghost"
              aria-label="Minimizar"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                document.body.style.cursor = '';
                onMinimize && onMinimize();
              }}
              style={{
                fontSize: 13,
                background: 'none',
                boxShadow: 'none',
                border: 'none',
                color: controlButtonColor,
                marginRight: 2,
                cursor: 'pointer',
                padding: 2,
                borderRadius: 6,
                transition: 'background 0.15s',
                fontFamily: fontStack,
              }}
              tabIndex={0}
              onMouseOver={(e) => (e.currentTarget.style.background = '#23272f')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
            >
              <FiMinus />
            </button>
          )}
          {showClose && (
            <button
              className="btn-ghost"
              aria-label="Fechar"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onClose && onClose();
              }}
              style={{
                fontSize: 13,
                background: 'none',
                boxShadow: 'none',
                border: 'none',
                color: controlButtonColor,
                cursor: 'pointer',
                padding: 2,
                borderRadius: 6,
                transition: 'background 0.15s',
                fontFamily: fontStack,
              }}
              tabIndex={0}
              onMouseOver={(e) => (e.currentTarget.style.background = '#23272f')}
              onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
            >
              <FiX />
            </button>
          )}
        </div>
      </div>
      <div
        className="window-content"
        style={{
          background: bodyColor,
          borderBottomLeftRadius: BORDER_RADIUS,
          borderBottomRightRadius: BORDER_RADIUS,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            background: bodyColor,
            borderRadius: BORDER_RADIUS,
            boxShadow:
              bodyShadowColor && bodyShadowOpacity !== undefined
                ? `0 6px 28px 0 rgba(${parseInt(bodyShadowColor.slice(1, 3), 16)},${parseInt(bodyShadowColor.slice(3, 5), 16)},${parseInt(bodyShadowColor.slice(5, 7), 16)},${bodyShadowOpacity})`
                : bodyShadow,
            padding: 48,
            minWidth: 480,
            minHeight: 220,
            color: '#e3e6f0',
            fontSize: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            maxWidth: 900,
            margin: '0 auto',
            fontFamily: fontStack,
            borderTop: '1.5px solid rgba(255,255,255,0.07)',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export { Window };
