"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { createPortal } from "react-dom";

const IMAGE_ZOOM_THRESHOLD = 400;

function isSvgImage(src: string): boolean {
  return src.toLowerCase().endsWith(".svg") || src.startsWith("data:image/svg");
}

interface ImageZoomModalProps {
  src: string;
  alt: string;
  onClose: () => void;
}

function ImageZoomModal({ src, alt, onClose }: ImageZoomModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-zoom-out"
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain cursor-default"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <X size={24} />
      </button>
    </div>,
    document.body
  );
}

interface CopyButtonProps {
  code: string;
  wrapper: HTMLElement;
}

function CopyButton({ code, wrapper }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const parent = wrapper.parentElement;
    if (!parent) return;

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    parent.addEventListener("mouseenter", onEnter);
    parent.addEventListener("mouseleave", onLeave);

    return () => {
      parent.removeEventListener("mouseenter", onEnter);
      parent.removeEventListener("mouseleave", onLeave);
    };
  }, [wrapper]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded transition-opacity bg-gray-200 hover:bg-gray-300 text-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
      style={{ opacity: hovered || copied ? 1 : 0 }}
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
}

export function MarkdownEnhancements({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomedImage, setZoomedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);
  const [codeBlocks, setCodeBlocks] = useState<
    { container: HTMLElement; code: string }[]
  >([]);

  const handleImageClick = useCallback((e: MouseEvent) => {
    const img = e.currentTarget as HTMLImageElement;
    const canZoom =
      isSvgImage(img.src) || img.naturalWidth >= IMAGE_ZOOM_THRESHOLD;
    if (canZoom) {
      setZoomedImage({ src: img.src, alt: img.alt || "" });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Process code blocks
    const preElements = container.querySelectorAll("pre");
    const blocks: { container: HTMLElement; code: string }[] = [];

    preElements.forEach((pre) => {
      if (pre.dataset.enhanced) return;
      pre.dataset.enhanced = "true";

      // Create wrapper for positioning
      const wrapper = document.createElement("div");
      wrapper.style.position = "relative";
      wrapper.style.marginLeft = "-1rem";
      wrapper.style.marginRight = "-1rem";
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      // Create button mount point
      const buttonMount = document.createElement("div");
      wrapper.appendChild(buttonMount);

      const code =
        pre.querySelector("code")?.textContent || pre.textContent || "";
      blocks.push({ container: buttonMount, code });
    });

    setCodeBlocks(blocks);

    // Process images for zoom
    const images = container.querySelectorAll("img");
    images.forEach((img) => {
      if (img.dataset.zoomEnabled) return;
      img.dataset.zoomEnabled = "true";

      const updateStyles = () => {
        const canZoom =
          isSvgImage(img.src) || img.naturalWidth >= IMAGE_ZOOM_THRESHOLD;
        img.style.cursor = canZoom ? "zoom-in" : "default";

        // Apply wider margins to zoomable images
        const target = img.parentElement?.tagName === "PICTURE"
          ? img.parentElement
          : img;

        if (canZoom) {
          (target as HTMLElement).style.marginLeft = "-1rem";
          (target as HTMLElement).style.marginRight = "-1rem";
          (target as HTMLElement).style.width = "calc(100% + 2rem)";
          (target as HTMLElement).style.maxWidth = "none";
        }
      };

      if (isSvgImage(img.src) || img.complete) {
        updateStyles();
      } else {
        img.addEventListener("load", updateStyles);
      }

      img.addEventListener("click", handleImageClick as EventListener);
    });

    return () => {
      images.forEach((img) => {
        img.removeEventListener("click", handleImageClick as EventListener);
      });
    };
  }, [children, handleImageClick]);

  return (
    <>
      <div ref={containerRef}>{children}</div>

      {codeBlocks.map(({ container, code }, index) =>
        createPortal(
          <CopyButton key={index} code={code} wrapper={container} />,
          container
        )
      )}

      {zoomedImage && (
        <ImageZoomModal
          src={zoomedImage.src}
          alt={zoomedImage.alt}
          onClose={() => setZoomedImage(null)}
        />
      )}
    </>
  );
}
