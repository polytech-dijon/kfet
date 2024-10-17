import * as React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Command, CommandStatus } from '../types/db';

export default function StatusSelector({command, onClick} : { command : Command, onClick : (command: Command) => void}) {
  const [status, setStatus] = React.useState<string | null>('left');

  const handleStatus = (
    event: React.MouseEvent<HTMLElement>,
    newStatus: CommandStatus,
  ) => {
    if (command.status === newStatus || newStatus === null){
      return;
    }
    setStatus(newStatus);
    command.status = newStatus;
    onClick(command);
  };

  React.useEffect(() => {
    setStatus(command.status);
  });

  return (
    <ToggleButtonGroup
      value={status}
      exclusive
      onChange={handleStatus}
      aria-label="command status"
    >
      <ToggleButton value={CommandStatus.PENDING} aria-label="not started" color="error">
        <CancelIcon />
      </ToggleButton>
      <ToggleButton value={CommandStatus.IN_PROGRESS} aria-label="ongoing" color="warning">
        <WatchLaterIcon />
      </ToggleButton>
      <ToggleButton value={CommandStatus.DONE} aria-label="complete" color="success">
        <CheckCircleIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
