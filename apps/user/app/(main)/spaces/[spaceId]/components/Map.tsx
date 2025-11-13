"use client";
import React, { useRef, useEffect } from "react";

interface MapProps {
  /** 도로명 주소 (ex. "서울특별시 강남구 테헤란로 123") */
  addressRoad: string;
}

/**
 * Map 컴포넌트
 * ---------------------------------------
 * - Kakao 지도 SDK를 이용해 지도 표시
 * - 전달받은 도로명 주소(addressRoad)를 좌표로 변환하여 지도에 마커 표시
 * - useRef를 이용해 div 요소를 지도 컨테이너로 사용
 */
export default function Map({ addressRoad }: MapProps) {
  /** 지도 DOM 요소를 참조할 ref */
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /**
     * window.kakao.maps가 아직 로드되지 않았거나
     * mapRef가 준비되지 않았다면 아무것도 실행하지 않음
     */
    if (!window.kakao?.maps || !mapRef.current) return;

    /**
     * 주소 문자열에서 불필요한 뒷부분 제거
     * 예: "서울시 강남구 어딘가 - 상세" → "서울시 강남구 어딘가"
     */
    const cleanAddress = addressRoad.split(" - ")[0].trim();

    /**
     * Kakao Maps SDK가 로드된 후 실행할 콜백
     * window.kakao.maps.load() 내부에서 지도를 초기화함
     */
    window.kakao.maps.load(() => {
      /** 기본 지도 옵션 (초기 중심 좌표 및 확대 레벨 설정) */
      const mapOption = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 기본 중심 (제주도)
        level: 3, // 확대 레벨 (숫자가 작을수록 더 확대)
      };

      /** 지도 객체 생성 (mapRef.current가 컨테이너 역할) */
      const map = new window.kakao.maps.Map(mapRef.current, mapOption);

      /** 주소 → 좌표 변환을 위한 Geocoder 인스턴스 생성 */
      const geocoder = new window.kakao.maps.services.Geocoder();

      /**
       * 주소 검색 요청
       * - cleanAddress를 기반으로 좌표 조회
       * - 검색 결과가 성공(Status.OK)일 경우 지도에 마커 표시
       */
      geocoder.addressSearch(cleanAddress, (result: any, status: any) => {
        if (status === window.kakao.maps.services.Status.OK) {
          // 변환된 좌표값으로 LatLng 객체 생성
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);

          /** ✅ 해당 위치에 기본 마커 표시 */
          const marker = new window.kakao.maps.Marker({
            map, // 마커를 표시할 지도 객체
            position: coords, // 마커 위치
          });

          /** 지도의 중심을 해당 좌표로 이동 */
          map.setCenter(coords);
        }
      });
    });
  }, [addressRoad]); // addressRoad가 변경될 때마다 지도 갱신

  /** 지도를 렌더링할 div 요소 */
  return <div ref={mapRef} style={{ width: "100%", height: "300px" }} />;
}
