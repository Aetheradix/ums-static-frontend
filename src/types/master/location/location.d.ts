declare namespace Master {
  // State
  interface StateForm {
    code: string;
    name: string;
    isActive: boolean;
  }
  type StateItem = Data.WithId<StateForm>;

  // Division
  interface DivisionForm {
    code: string;
    name: string;
    stateId: number;
    isActive: boolean;
  }
  type DivisionItem = Data.WithId<DivisionForm> & { stateName: string };

  // District
  interface DistrictForm {
    code: string;
    name: string;
    divisionId: number;
    isActive: boolean;
  }
  type DistrictItem = Data.WithId<DistrictForm> & { divisionName: string };

  // Tehsil
  interface TehsilForm {
    code: string;
    name: string;
    districtId: number;
    isActive: boolean;
  }
  type TehsilItem = Data.WithId<TehsilForm> & { districtName: string };

  // Block
  interface BlockForm {
    code: string;
    name: string;
    districtId: number;
    tehsilId: number;
    isActive: boolean;
  }
  type BlockItem = Data.WithId<BlockForm> & {
    districtName: string;
    tehsilName: string;
  };
}
