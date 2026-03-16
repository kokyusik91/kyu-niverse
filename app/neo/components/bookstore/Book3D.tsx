"use client";

import { useRef, useState, useMemo, Suspense, useEffect } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Environment,
  ScrollControls,
  Scroll,
  useScroll,
} from "@react-three/drei";
import * as THREE from "three";
import type { BookData } from "./BookstoreContent";

const COVER_W = 2.4;
const COVER_H = 3.4;
const COVER_T = 0.03;
const PAGE_W = COVER_W - 0.06;
const PAGE_H = COVER_H - 0.06;
const PAGE_D = 0.28;
const ROW_GAP = 0.5;
const LERP_SPEED = 0.1;
const DETAIL_LERP_SPEED = 0.12;

function createPageEdgeTexture(
  width: number,
  height: number,
  lineDir: "vertical" | "horizontal",
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f5f0e8";
  ctx.fillRect(0, 0, width, height);

  const count = 100;
  for (let i = 0; i < count; i++) {
    const pos =
      lineDir === "vertical"
        ? (i / count) * width
        : (i / count) * height;
    const alpha = 0.06 + Math.random() * 0.1;
    ctx.fillStyle = `rgba(160, 150, 130, ${alpha})`;
    if (lineDir === "vertical") {
      ctx.fillRect(Math.floor(pos), 0, 1, height);
    } else {
      ctx.fillRect(0, Math.floor(pos), width, 1);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const BOOK_AUTHORS: Record<string, string> = {
  kludge: "게리 마커스",
  superrich: "러셀 시몬스",
  system: "샘 카프만",
  logical: "데루야 하나코",
  personal: "조연심",
  trend2023: "김난도",
  wanna: "류이치 사카모토",
  passinglane: "엠제이 드마코",
  wellthinking: "이동귀",
  reverage: "롭 무어",
  trend2024: "김난도",
  mental: "김다슬",
  economy: "장하준",
  reverser: "론 프리드먼",
};

function createSpineTexture(
  title: string,
  bgColor: THREE.Color,
): THREE.CanvasTexture {
  // Canvas ratio must match the -X face ratio: PAGE_D(0.28) : COVER_H(3.4) ≈ 1:12
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 1536;
  const ctx = canvas.getContext("2d")!;

  const r = Math.round(bgColor.r * 255);
  const g = Math.round(bgColor.g * 255);
  const b = Math.round(bgColor.b * 255);
  ctx.fillStyle = `rgb(${r},${g},${b})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(Math.PI / 2);

  const brightness = (r + g + b) / 3;
  const textColor =
    brightness > 128 ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)";

  const author = BOOK_AUTHORS[title] ?? "";
  const spineText = author ? `${title}  —  ${author}` : title;

  ctx.fillStyle = textColor;
  ctx.font =
    "bold 72px 'Pretendard', 'Apple SD Gothic Neo', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(spineText, 0, 0);

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
}

function BookModel({
  coverImageUrl,
  title,
  index,
  totalBooks,
  isSelected,
  isAnySelected,
  onClick,
  onColorExtracted,
}: {
  coverImageUrl: string;
  title: string;
  index: number;
  totalBooks: number;
  isSelected: boolean;
  isAnySelected: boolean;
  onClick: () => void;
  onColorExtracted?: (color: string) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const dragRotation = useRef({ x: 0, y: 0.3 });
  const scroll = useScroll();
  const { viewport } = useThree();

  // 선택 해제 시 드래그 회전 리셋
  useEffect(() => {
    if (!isSelected) {
      dragRotation.current = { x: 0, y: 0.3 };
      isDragging.current = false;
    }
  }, [isSelected]);

  const coverTexture = useLoader(THREE.TextureLoader, coverImageUrl);
  coverTexture.colorSpace = THREE.SRGBColorSpace;
  coverTexture.minFilter = THREE.LinearFilter;
  coverTexture.magFilter = THREE.LinearFilter;
  coverTexture.anisotropy = 16;

  const edgeColor = useMemo(() => {
    const img = coverTexture.image as HTMLImageElement;
    const canvas = document.createElement("canvas");
    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    // Sample 1px border from all four edges for accurate edge color
    let r = 0, g = 0, b = 0, count = 0;
    const borders = [
      ctx.getImageData(0, 0, w, 1).data,       // top
      ctx.getImageData(0, h - 1, w, 1).data,   // bottom
      ctx.getImageData(0, 0, 1, h).data,        // left
      ctx.getImageData(w - 1, 0, 1, h).data,   // right
    ];
    for (const data of borders) {
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
        count++;
      }
    }
    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    return new THREE.Color(r / 255, g / 255, b / 255);
  }, [coverTexture]);

  useEffect(() => {
    if (onColorExtracted) {
      onColorExtracted("#" + edgeColor.getHexString());
    }
  }, [edgeColor, onColorExtracted]);

  const spineTex = useMemo(
    () => createSpineTexture(title, edgeColor),
    [title, edgeColor],
  );

  const spineMat = useMemo(
    () => {
      const solid = new THREE.MeshBasicMaterial({ color: edgeColor });
      // BoxGeometry face order: [+X, -X, +Y, -Y, +Z, -Z]
      // -X (index 1) is the outward-facing spine face
      return [
        solid,
        new THREE.MeshBasicMaterial({ map: spineTex }),
        solid,
        solid,
        solid,
        solid,
      ];
    },
    [edgeColor, spineTex],
  );

  const foreEdgeTex = useMemo(
    () => createPageEdgeTexture(512, 256, "vertical"),
    [],
  );
  const topEdgeTex = useMemo(
    () => createPageEdgeTexture(512, 256, "horizontal"),
    [],
  );

  const frontCoverMat = useMemo(
    () => {
      const edgeMat = new THREE.MeshBasicMaterial({ color: edgeColor });
      return [
        edgeMat, edgeMat, edgeMat, edgeMat,
        new THREE.MeshBasicMaterial({ map: coverTexture }),
        edgeMat,
      ];
    },
    [coverTexture, edgeColor],
  );

  const pageMat = useMemo(
    () => {
      const pageSolid = new THREE.MeshBasicMaterial({ color: "#f5f0e8" });
      return [
        new THREE.MeshBasicMaterial({ map: foreEdgeTex }),
        pageSolid,
        new THREE.MeshBasicMaterial({ map: topEdgeTex }),
        new THREE.MeshBasicMaterial({ map: topEdgeTex }),
        pageSolid,
        pageSolid,
      ];
    },
    [foreEdgeTex, topEdgeTex],
  );

  const baseY = -index * ROW_GAP;
  const halfPage = PAGE_D / 2;
  const parentWorldPos = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    if (!groupRef.current) return;

    const scrollOffset = scroll.offset;
    const bookProgress = index / Math.max(1, totalBooks - 1);
    const distance = Math.abs(scrollOffset - bookProgress);
    const proximity = Math.max(0, 1 - distance * totalBooks * 0.5);

    if (isSelected) {
      // Scroll 그룹 이동 보정 → 화면 중앙 고정
      groupRef.current.parent?.getWorldPosition(parentWorldPos);
      const compensateY = -parentWorldPos.y;

      const targetX = -viewport.width * 0.18;
      const targetY = compensateY;
      const targetZ = -1.5;
      const targetRotX = dragRotation.current.x;
      const targetRotY = dragRotation.current.y;
      const targetRotZ = 0;

      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x, targetX, DETAIL_LERP_SPEED,
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y, targetY, DETAIL_LERP_SPEED,
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z, targetZ, DETAIL_LERP_SPEED,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, targetRotX, DETAIL_LERP_SPEED,
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, targetRotY, DETAIL_LERP_SPEED,
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z, targetRotZ, DETAIL_LERP_SPEED,
      );
    } else if (isAnySelected) {
      // 다른 책 선택됨 → 축소해서 숨기기
      const s = groupRef.current.scale.x;
      const targetScale = 0;
      const newScale = THREE.MathUtils.lerp(s, targetScale, LERP_SPEED);
      groupRef.current.scale.set(newScale, newScale, newScale);
    } else {
      // 기본: 눕혀진 스택 (scale 복원)
      const s = groupRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(s, 1, LERP_SPEED);
      groupRef.current.scale.set(newScale, newScale, newScale);

      const hoverZ = hovered ? 0.6 : 0;
      const proximityZ = proximity * 0.3;

      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x, 0, LERP_SPEED,
      );
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y, baseY, LERP_SPEED,
      );
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z, hoverZ + proximityZ, LERP_SPEED,
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, -Math.PI / 2, LERP_SPEED,
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y, 0, LERP_SPEED,
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z, Math.PI / 2, LERP_SPEED,
      );
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, baseY, 0]}
      rotation={[-Math.PI / 2, 0, Math.PI / 2]}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (isSelected) {
          isDragging.current = true;
          lastPointer.current = { x: e.clientX, y: e.clientY };
          document.body.style.cursor = "grabbing";
        }
      }}
      onPointerMove={(e) => {
        if (!isDragging.current || !isSelected) return;
        const dx = e.clientX - lastPointer.current.x;
        const dy = e.clientY - lastPointer.current.y;
        dragRotation.current.y += dx * 0.008;
        dragRotation.current.x += dy * 0.008;
        dragRotation.current.x = Math.max(
          -Math.PI / 3,
          Math.min(Math.PI / 3, dragRotation.current.x),
        );
        lastPointer.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => {
        isDragging.current = false;
        document.body.style.cursor = "grab";
      }}
      onClick={(e) => {
        e.stopPropagation();
        if (!isSelected) onClick();
      }}
      onPointerOver={(e) => {
        setHovered(true);
        document.body.style.cursor = isSelected ? "grab" : "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        isDragging.current = false;
        document.body.style.cursor = "auto";
      }}
    >
      <mesh
        position={[0, 0, halfPage + COVER_T / 2]}
        material={frontCoverMat}
      >
        <boxGeometry args={[COVER_W, COVER_H, COVER_T]} />
      </mesh>

      <mesh position={[0, 0, -(halfPage + COVER_T / 2)]}>
        <boxGeometry args={[COVER_W, COVER_H, COVER_T]} />
        <meshBasicMaterial color={edgeColor} />
      </mesh>

      <mesh position={[-COVER_W / 2 + COVER_T / 2, 0, 0]} material={spineMat}>
        <boxGeometry args={[COVER_T, COVER_H, PAGE_D]} />
      </mesh>

      <mesh
        position={[-COVER_W / 2 + COVER_T + PAGE_W / 2, 0, 0]}
        material={pageMat}
      >
        <boxGeometry args={[PAGE_W, PAGE_H, PAGE_D]} />
      </mesh>
    </group>
  );
}

function BookList({
  books,
  selectedId,
  onSelect,
  onColorExtracted,
}: {
  books: BookData[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onColorExtracted: (bookId: string, color: string) => void;
}) {
  return (
    <Scroll>
      {books.map((book, i) => (
        <Suspense key={book.id} fallback={null}>
          <BookModel
            coverImageUrl={book.coverUrl}
            title={book.title}
            index={i}
            totalBooks={books.length}
            isSelected={selectedId === book.id}
            isAnySelected={selectedId !== null}
            onClick={() => {
              if (selectedId !== book.id) onSelect(book.id);
            }}
            onColorExtracted={(color) => onColorExtracted(book.id, color)}
          />
        </Suspense>
      ))}

      {/* 배경 클릭 — 선택 중이 아닐 때만 해제 가능 */}
      <mesh
        position={[0, -(books.length * ROW_GAP) / 2, -3]}
        visible={false}
        onClick={() => {
          if (!selectedId) onSelect(null);
        }}
      >
        <planeGeometry args={[30, books.length * ROW_GAP + 10]} />
      </mesh>
    </Scroll>
  );
}

export default function Bookshelf3D({
  books,
  selectedId,
  onSelect,
  onColorExtracted,
}: {
  books: BookData[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onColorExtracted: (bookId: string, color: string) => void;
}) {
  const scrollPages = Math.max(1, books.length * 0.25);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          logarithmicDepthBuffer: true,
        }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 8, 5]} intensity={1.0} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <pointLight position={[0, 3, 4]} intensity={0.4} color="#ffeedd" />

        <ScrollControls pages={scrollPages} damping={0.25}>
          <Suspense fallback={null}>
            <BookList
              books={books}
              selectedId={selectedId}
              onSelect={onSelect}
              onColorExtracted={onColorExtracted}
            />
          </Suspense>
        </ScrollControls>

        <Environment preset="studio" environmentIntensity={0.3} />
      </Canvas>
    </div>
  );
}
