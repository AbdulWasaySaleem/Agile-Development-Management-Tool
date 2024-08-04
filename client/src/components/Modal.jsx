import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from '@mui/material';

const EditProfileModal = ({
  open,
  onClose,
  profileData,
  onProfileDataChange,
  onUpdate,
}) => (
  <Dialog open={open} fullWidth maxWidth="sm">
    <DialogTitle>Edit Profile</DialogTitle>
    <DialogContent>
      <Stack spacing={2} margin={2}>
        <TextField
          variant="outlined"
          label="Username"
          name="name"
          value={profileData.name}
          onChange={onProfileDataChange}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Email Address"
          name="email"
          value={profileData.email}
          onChange={onProfileDataChange}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Biography"
          name="biography"
          value={profileData.biography}
          onChange={onProfileDataChange}
          fullWidth
          multiline
        />
        <TextField
          variant="outlined"
          label="Phone Number"
          name="phone"
          value={profileData.phone}
          onChange={onProfileDataChange}
          fullWidth
        />
        <TextField
          variant="outlined"
          label="Home Address"
          name="address"
          value={profileData.address}
          onChange={onProfileDataChange}
          fullWidth
        />
        {/* Add more fields as needed */}
        <Button color="success" variant="contained" onClick={onUpdate}>
          Update
        </Button>
      </Stack>
    </DialogContent>
    <DialogActions>
      <Button color="error" variant="contained" onClick={onClose}>
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default EditProfileModal;
