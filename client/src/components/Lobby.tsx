import { Button, Stack } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
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
      console.log("roomList", data);
    })
  })

  const handleChange = (event: SelectChangeEvent) => {
    setRoomSelection(event.target.value);
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      sx={{ py: 1, height: "100vh" }}
    >
      <CustomDialog
        open={roomDialogOpen}
        // handleClose={() => setRoomDialogOpen(false)}
        title="Opponent Selection"
        contentText="Select your opponent to play against"
        handleContinue={() => {
          if (!roomSelection) return; // if given room input is valid, do nothing.
          socket.emit("joinRoom", { roomId: roomSelection }, (r: { error: any; message: SetStateAction<string>; roomId: any; players: any; }) => {
            // r is the response from the server
            if (r.error) return setRoomError(r.message); // if an error is returned in the response set roomError to the error message and exit
            console.log("response:", r);
            setRoom(r?.roomId); // set room to the room ID
            setPlayers(r?.players); // set players array to the array of players in the room
            setOrientation("Allies");
            setRoomDialogOpen(false);
          });
        }}
      >
      <FormControl sx={{ m: 1, minWidth: 120 }} disabled={roomList.length === 0}>
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
        {/* <TextField
          autoFocus
          margin="dense"
          id="room"
          label="Room ID"
          name="room"
          value={roomInput}
          required
          onChange={(e) => setRoomInput(e.target.value)}
          type="text"
          fullWidth
          variant="standard"
          error={Boolean(roomError)}
          helperText={
            !roomError ? "Enter a room ID" : `Invalid room ID: ${roomError}`
          }
        /> */}
      </CustomDialog>
      {/* Button for starting a game */}
      <Button
        variant="contained"
        onClick={() => {
          socket.emit("createRoom", (r: any) => {
            console.log(r);
            setRoom(r);
            setOrientation("Axis");
          });
        }}
      >
        Start a game
      </Button>
      {/* Button for joining a game */}
      <Button
        onClick={() => {
          socket.emit("getRooms", (r: any) => {
            console.log(r);
            setRoomList(r);
          })
          setRoomDialogOpen(true);
        }}
      >
        Join a game
      </Button>
    </Stack>
  );
}
