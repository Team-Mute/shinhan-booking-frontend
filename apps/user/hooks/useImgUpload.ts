import { useCallback, useRef, useState } from "react";

export function useImgUpload(maxFiles = 5) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => inputRef.current?.click();

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const picked = Array.from(fileList);
      setFiles((prev) => [...prev, ...picked].slice(0, maxFiles));
    },
    [maxFiles]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
    setIsDragging(false);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clear = () => setFiles([]);
  const removeAt = (idx: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const move = (from: number, to: number) =>
    setFiles((prev) => {
      const next = [...prev];
      const [it] = next.splice(from, 1);
      next.splice(to, 0, it);
      return next;
    });

  return {
    files,
    isDragging,
    inputRef,
    openPicker,
    onChange,
    onDrop,
    onDragOver,
    onDragEnter,
    onDragLeave,
    clear,
    removeAt,
    move,
  };
}
