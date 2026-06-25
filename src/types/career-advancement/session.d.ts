declare namespace CareerAdvancement {
  namespace Session {
    interface SessionForm {
      sessionName: string;
      sessionType: string;
      startDateTime: Date | null;
      endDateTime: Date | null;
      appStatus: string;
      sessionFrom: Date | null;
      sessionTo: Date | null;
      isActive?: boolean;
    }

    interface SessionCommand {
      sessionName: string;
      sessionType: string;
      startDateTime: string;
      endDateTime: string;
      appStatus: string;
      sessionFrom: string;
      sessionTo: string;
    }

    type SessionItem = Data.WithId<{
      sessionName: string;
      sessionType: string;
      startDateTime: string;
      endDateTime: string;
      appStatus: string;
      sessionFrom: string;
      sessionTo: string;
      isActive: boolean;
    }>;
  }
}
