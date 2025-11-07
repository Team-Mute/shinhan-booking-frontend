import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // useState에 함수를 전달하여 lazy initialization (최초 렌더링 시에만 실행)
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 클라이언트 환경 체크
      if (typeof window === 'undefined') {
        return initialValue;
      }

      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`localStorage에서 ${key} 읽기 실패:`, error);
      return initialValue;
    }
  });

  // storedValue가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`localStorage에 ${key} 저장 실패:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}