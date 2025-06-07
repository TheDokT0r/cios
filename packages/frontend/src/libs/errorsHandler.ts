import { toast } from "@zerodevx/svelte-toast";
import { ErrorCodes } from "shared";

export default function errorHandler(code: ErrorCodes) {
  switch (code) {
    case ErrorCodes.INVALID_IP: {
      return toast.push("Invalid IP");
    }
    case ErrorCodes.INVALID_MESSAGE_TYPE: {
      return toast.push("Invalid Message Type");
    }
    case ErrorCodes.INVALID_PASSWORD: {
      return toast.push("Incorrect Password");
    }
    case ErrorCodes.INVALID_ROOM_ID_FORMAT: {
      return toast.push("Invalid Room ID format");
    }
    case ErrorCodes.NO_PUBLIC_ROOMS: {
      return toast.push("No Public rooms were found");
    }
    case ErrorCodes.REQUIRES_PASSWORD: {
      return toast.push("Room requires password");
    }
    case ErrorCodes.NOT_IN_ROOM: {
      return toast.push("You're currently not in a room");
    }
  }
}
