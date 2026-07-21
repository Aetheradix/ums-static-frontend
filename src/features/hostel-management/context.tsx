import React, { createContext, useContext, useState } from 'react';
import {
  mockHostels,
  mockBuildings,
  mockRoomTypes,
  mockRoomAssets,
  mockBasicFacilities,
  mockItemCategories,
  mockItems,
  mockShifts,
  mockMessMenus,
  mockStudentApplications,
  mockRoomAllotments,
  mockCheckInRecords,
  mockRoomChangeRequests,
  mockGatePasses,
  mockLeaveRequests,
  mockAttendanceRecords,
  mockVisitorRecords,
  mockDisciplinaryActions,
  mockIncidentReports,
  mockMaintenanceRequests,
  mockStockTransactions,
  mockVendors,
  mockPurchaseOrders,
  mockHostelStaff,
  mockStaffAttendance,
  mockStudentDashboard,
  type StudentDashboardData,
} from './mockData';

interface HostelContextValue {
  hostels: HostelManagement.Hostel[];
  setHostels: React.Dispatch<React.SetStateAction<HostelManagement.Hostel[]>>;

  buildings: HostelManagement.Building[];
  setBuildings: React.Dispatch<
    React.SetStateAction<HostelManagement.Building[]>
  >;

  roomTypes: HostelManagement.RoomType[];
  setRoomTypes: React.Dispatch<
    React.SetStateAction<HostelManagement.RoomType[]>
  >;

  roomAssets: HostelManagement.RoomAsset[];
  setRoomAssets: React.Dispatch<
    React.SetStateAction<HostelManagement.RoomAsset[]>
  >;

  basicFacilities: HostelManagement.BasicFacility[];
  setBasicFacilities: React.Dispatch<
    React.SetStateAction<HostelManagement.BasicFacility[]>
  >;

  itemCategories: HostelManagement.ItemCategory[];
  setItemCategories: React.Dispatch<
    React.SetStateAction<HostelManagement.ItemCategory[]>
  >;

  items: HostelManagement.InventoryItem[];
  setItems: React.Dispatch<
    React.SetStateAction<HostelManagement.InventoryItem[]>
  >;

  shifts: HostelManagement.Shift[];
  setShifts: React.Dispatch<React.SetStateAction<HostelManagement.Shift[]>>;

  messMenus: HostelManagement.MessMenu[];
  setMessMenus: React.Dispatch<
    React.SetStateAction<HostelManagement.MessMenu[]>
  >;

  studentApplications: HostelManagement.StudentApplication[];
  setStudentApplications: React.Dispatch<
    React.SetStateAction<HostelManagement.StudentApplication[]>
  >;

  roomAllotments: HostelManagement.RoomAllotment[];
  setRoomAllotments: React.Dispatch<
    React.SetStateAction<HostelManagement.RoomAllotment[]>
  >;

  checkInRecords: HostelManagement.CheckInRecord[];
  setCheckInRecords: React.Dispatch<
    React.SetStateAction<HostelManagement.CheckInRecord[]>
  >;

  roomChangeRequests: HostelManagement.RoomChangeRequest[];
  setRoomChangeRequests: React.Dispatch<
    React.SetStateAction<HostelManagement.RoomChangeRequest[]>
  >;

  gatePasses: HostelManagement.GatePass[];
  setGatePasses: React.Dispatch<
    React.SetStateAction<HostelManagement.GatePass[]>
  >;

  leaveRequests: HostelManagement.LeaveRequest[];
  setLeaveRequests: React.Dispatch<
    React.SetStateAction<HostelManagement.LeaveRequest[]>
  >;

  attendanceRecords: HostelManagement.AttendanceRecord[];
  setAttendanceRecords: React.Dispatch<
    React.SetStateAction<HostelManagement.AttendanceRecord[]>
  >;

  visitorRecords: HostelManagement.VisitorRecord[];
  setVisitorRecords: React.Dispatch<
    React.SetStateAction<HostelManagement.VisitorRecord[]>
  >;

  disciplinaryActions: HostelManagement.DisciplinaryAction[];
  setDisciplinaryActions: React.Dispatch<
    React.SetStateAction<HostelManagement.DisciplinaryAction[]>
  >;

  incidentReports: HostelManagement.IncidentReport[];
  setIncidentReports: React.Dispatch<
    React.SetStateAction<HostelManagement.IncidentReport[]>
  >;

  maintenanceRequests: HostelManagement.MaintenanceRequest[];
  setMaintenanceRequests: React.Dispatch<
    React.SetStateAction<HostelManagement.MaintenanceRequest[]>
  >;

  stockTransactions: HostelManagement.StockTransaction[];
  setStockTransactions: React.Dispatch<
    React.SetStateAction<HostelManagement.StockTransaction[]>
  >;

  vendors: HostelManagement.Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<HostelManagement.Vendor[]>>;

  purchaseOrders: HostelManagement.PurchaseOrder[];
  setPurchaseOrders: React.Dispatch<
    React.SetStateAction<HostelManagement.PurchaseOrder[]>
  >;

  hostelStaff: HostelManagement.HostelStaff[];
  setHostelStaff: React.Dispatch<
    React.SetStateAction<HostelManagement.HostelStaff[]>
  >;

  staffAttendance: HostelManagement.StaffAttendance[];
  setStaffAttendance: React.Dispatch<
    React.SetStateAction<HostelManagement.StaffAttendance[]>
  >;

  firstAidLogs: HostelManagement.FirstAidLog[];
  setFirstAidLogs: React.Dispatch<
    React.SetStateAction<HostelManagement.FirstAidLog[]>
  >;

  mealAttendance: HostelManagement.MealAttendance[];
  setMealAttendance: React.Dispatch<
    React.SetStateAction<HostelManagement.MealAttendance[]>
  >;

  medicalEmergencies: HostelManagement.MedicalEmergency[];
  setMedicalEmergencies: React.Dispatch<
    React.SetStateAction<HostelManagement.MedicalEmergency[]>
  >;

  messFeedback: HostelManagement.MessFeedback[];
  setMessFeedback: React.Dispatch<
    React.SetStateAction<HostelManagement.MessFeedback[]>
  >;

  sickDietRequests: HostelManagement.SickDietRequest[];
  setSickDietRequests: React.Dispatch<
    React.SetStateAction<HostelManagement.SickDietRequest[]>
  >;

  studentDashboard: StudentDashboardData;

  notification: HostelManagement.Notification | null;
  triggerNotification: (message: string, type?: 'success' | 'error') => void;
}

const HostelContext = createContext<HostelContextValue | null>(null);

export function HostelProvider({ children }: { children: React.ReactNode }) {
  const [hostels, setHostels] =
    useState<HostelManagement.Hostel[]>(mockHostels);
  const [buildings, setBuildings] =
    useState<HostelManagement.Building[]>(mockBuildings);
  const [roomTypes, setRoomTypes] =
    useState<HostelManagement.RoomType[]>(mockRoomTypes);
  const [roomAssets, setRoomAssets] =
    useState<HostelManagement.RoomAsset[]>(mockRoomAssets);
  const [basicFacilities, setBasicFacilities] =
    useState<HostelManagement.BasicFacility[]>(mockBasicFacilities);
  const [itemCategories, setItemCategories] =
    useState<HostelManagement.ItemCategory[]>(mockItemCategories);
  const [items, setItems] =
    useState<HostelManagement.InventoryItem[]>(mockItems);
  const [shifts, setShifts] = useState<HostelManagement.Shift[]>(mockShifts);
  const [messMenus, setMessMenus] =
    useState<HostelManagement.MessMenu[]>(mockMessMenus);

  const [studentApplications, setStudentApplications] = useState<
    HostelManagement.StudentApplication[]
  >(mockStudentApplications);
  const [roomAllotments, setRoomAllotments] =
    useState<HostelManagement.RoomAllotment[]>(mockRoomAllotments);
  const [checkInRecords, setCheckInRecords] =
    useState<HostelManagement.CheckInRecord[]>(mockCheckInRecords);
  const [roomChangeRequests, setRoomChangeRequests] = useState<
    HostelManagement.RoomChangeRequest[]
  >(mockRoomChangeRequests);

  const [gatePasses, setGatePasses] =
    useState<HostelManagement.GatePass[]>(mockGatePasses);
  const [leaveRequests, setLeaveRequests] =
    useState<HostelManagement.LeaveRequest[]>(mockLeaveRequests);
  const [attendanceRecords, setAttendanceRecords] = useState<
    HostelManagement.AttendanceRecord[]
  >(mockAttendanceRecords);
  const [visitorRecords, setVisitorRecords] =
    useState<HostelManagement.VisitorRecord[]>(mockVisitorRecords);
  const [disciplinaryActions, setDisciplinaryActions] = useState<
    HostelManagement.DisciplinaryAction[]
  >(mockDisciplinaryActions);
  const [incidentReports, setIncidentReports] =
    useState<HostelManagement.IncidentReport[]>(mockIncidentReports);

  const [maintenanceRequests, setMaintenanceRequests] = useState<
    HostelManagement.MaintenanceRequest[]
  >(mockMaintenanceRequests);
  const [stockTransactions, setStockTransactions] = useState<
    HostelManagement.StockTransaction[]
  >(mockStockTransactions);
  const [vendors, setVendors] =
    useState<HostelManagement.Vendor[]>(mockVendors);
  const [purchaseOrders, setPurchaseOrders] =
    useState<HostelManagement.PurchaseOrder[]>(mockPurchaseOrders);
  const [hostelStaff, setHostelStaff] =
    useState<HostelManagement.HostelStaff[]>(mockHostelStaff);
  const [staffAttendance, setStaffAttendance] =
    useState<HostelManagement.StaffAttendance[]>(mockStaffAttendance);

  const [firstAidLogs, setFirstAidLogs] = useState<
    HostelManagement.FirstAidLog[]
  >([]);
  const [mealAttendance, setMealAttendance] = useState<
    HostelManagement.MealAttendance[]
  >([]);
  const [medicalEmergencies, setMedicalEmergencies] = useState<
    HostelManagement.MedicalEmergency[]
  >([]);
  const [messFeedback, setMessFeedback] = useState<
    HostelManagement.MessFeedback[]
  >([]);
  const [sickDietRequests, setSickDietRequests] = useState<
    HostelManagement.SickDietRequest[]
  >([]);

  const [notification, setNotification] =
    useState<HostelManagement.Notification | null>(null);

  const triggerNotification = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4500);
  };

  return (
    <HostelContext.Provider
      value={{
        hostels,
        setHostels,
        buildings,
        setBuildings,
        roomTypes,
        setRoomTypes,
        roomAssets,
        setRoomAssets,
        basicFacilities,
        setBasicFacilities,
        itemCategories,
        setItemCategories,
        items,
        setItems,
        shifts,
        setShifts,
        messMenus,
        setMessMenus,
        studentApplications,
        setStudentApplications,
        roomAllotments,
        setRoomAllotments,
        checkInRecords,
        setCheckInRecords,
        roomChangeRequests,
        setRoomChangeRequests,
        gatePasses,
        setGatePasses,
        leaveRequests,
        setLeaveRequests,
        attendanceRecords,
        setAttendanceRecords,
        visitorRecords,
        setVisitorRecords,
        disciplinaryActions,
        setDisciplinaryActions,
        incidentReports,
        setIncidentReports,
        maintenanceRequests,
        setMaintenanceRequests,
        stockTransactions,
        setStockTransactions,
        vendors,
        setVendors,
        purchaseOrders,
        setPurchaseOrders,
        hostelStaff,
        setHostelStaff,
        staffAttendance,
        setStaffAttendance,
        medicalEmergencies,
        setMedicalEmergencies,
        sickDietRequests,
        setSickDietRequests,
        firstAidLogs,
        setFirstAidLogs,
        mealAttendance,
        setMealAttendance,
        messFeedback,
        setMessFeedback,
        studentDashboard: mockStudentDashboard,
        notification,
        triggerNotification,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
}

export function useHostel(): HostelContextValue {
  const ctx = useContext(HostelContext);
  if (!ctx) throw new Error('useHostel must be used inside <HostelProvider>');
  return ctx;
}
