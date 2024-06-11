import { Button, Stack } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SetStateAction, useState, useEffect } from "react";
import CustomDialog from "./CustomDialog";
import { socket } from "../socket";

interface Props {
  setRoom: any;
  setOrientation: any;
  setPlayers: any;
}

export default function Lobby({ setRoom, setOrientation, setPlayers }: Props) {
  const [roomDialogOpen, setRoomDialogOpen] = useState(false);
  // const [roomInput, setRoomInput] = useState(""); // input state for text field
  const [roomError, setRoomError] = useState("");
  const [roomList, setRoomList] = useState<string[][]>([]);
  const [roomSelection, setRoomSelection] = useState("");

  useEffect(() => {
    socket.on("roomList", (data: string[][]) => {
      setRoomList(data);
    });
  });

  const handleChange = (event: SelectChangeEvent) => {
    setRoomSelection(event.target.value);
  };

  const onStart = () => {
    socket.emit("createRoom", (r: any) => {
      setRoom(r);
      setOrientation("Axis");
    });
  };

  const onJoin = () => {
    socket.emit("getRooms", (r: any) => {
      setRoomList(r);
    });
    setRoomDialogOpen(true);
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ py: 1, height: "100vh" }}
    >
      <CustomDialog
        open={roomDialogOpen}
        title="Opponent Selection"
        contentText="Select your opponent to play against"
        handleContinue={() => {
          if (!roomSelection) return;
          socket.emit(
            "joinRoom",
            { roomId: roomSelection },
            (r: {
              error: any;
              message: SetStateAction<string>;
              roomId: any;
              players: any;
            }) => {
              if (r.error) return setRoomError(r.message);
              console.log("response:", r);
              console.log(roomError);
              setRoom(r?.roomId);
              setPlayers(r?.players);
              setOrientation("Allies");
              setRoomDialogOpen(false);
            }
          );
        }}
        handleClose={() => setRoomDialogOpen(false)}
      >
        <FormControl
          sx={{ m: 1, minWidth: 120 }}
          disabled={roomList.length === 0}
        >
          <InputLabel id="room-selection-helper-label">Opponent</InputLabel>
          <Select
            labelId="room-selection-helper-label"
            id="room-selection-helper"
            value={roomSelection}
            label="Opponent"
            onChange={handleChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {roomList.map((room: string[]) => (
              <MenuItem value={room[0]} key={room[0]}>
                {room[1]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CustomDialog>
      {/* Button for starting a game */}
      <Button variant="contained" onMouseUp={onStart} onTouchEnd={onStart}>
        Start a game
      </Button>
      {/* Button for joining a game */}
      <Button onMouseUp={onJoin} onTouchEnd={onJoin}>
        Join a game
      </Button>
    </Stack>
  );
}
