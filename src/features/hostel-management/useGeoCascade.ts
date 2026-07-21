import { useState } from 'react';
import { GEO_TREE } from './mockData';

export const geoToOptions = (nodes: any[] | undefined) =>
  (nodes || []).map(n => ({ id: n.id, text: n.name }));
export const getGeoChildren = (path: (string | null)[]) => {
  let current: any[] = GEO_TREE;
  for (const id of path) {
    if (!id) return [];
    const node = current.find(n => n.id === id);
    if (!node) return [];
    current = node.children || [];
  }
  return current;
};

// Drives a 3-level cascade: District -> Block -> School (university-flavoured).
export function useGeoCascade() {
  const [district, setDistrict] = useState<string | null>(null);
  const [block, setBlock] = useState<string | null>(null);
  const [school, setSchool] = useState<string | null>(null);

  const districtOptions = geoToOptions(GEO_TREE);
  const blockOptions = geoToOptions(getGeoChildren([district]));
  const schoolOptions = geoToOptions(getGeoChildren([district, block]));

  const setSchoolSafe = (v: string | number | Data.DataItem<string> | null) => {
    setSchool(
      v === null || v === undefined
        ? null
        : String((v as Data.DataItem<string>).id ?? v)
    );
  };
  const onDistrict = (v: string | number | Data.DataItem<string> | null) => {
    setDistrict(
      v === null || v === undefined
        ? null
        : String((v as Data.DataItem<string>).id ?? v)
    );
    setBlock(null);
    setSchool(null);
  };
  const onBlock = (v: string | number | Data.DataItem<string> | null) => {
    setBlock(
      v === null || v === undefined
        ? null
        : String((v as Data.DataItem<string>).id ?? v)
    );
    setSchool(null);
  };

  const reset = () => {
    setDistrict(null);
    setBlock(null);
    setSchool(null);
  };

  return {
    district,
    block,
    school,
    districtOptions,
    blockOptions,
    schoolOptions,
    onDistrict,
    onBlock,
    setSchool: setSchoolSafe,
    reset,
  };
}
