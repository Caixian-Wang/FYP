import React, { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  Stack
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const App = () => {
  const [mediaType, setMediaType] = useState('picture');
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = ['Option1', 'Option2', 'Option3', 'Option4', 'Option5', 'Options'];

  const handleTypeChange = (_, newType) => {
    if (newType) setMediaType(newType);
  };

  const handleOptionToggle = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleReset = () => {
    setMediaType('picture');
    setSelectedOptions([]);
  };

  const handleStart = () => {
    console.log('提交参数:', { mediaType, selectedOptions });
    // TODO: 在此处添加API调用
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            家具识别系统
          </Typography>

          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <ToggleButtonGroup
              value={mediaType}
              exclusive
              onChange={handleTypeChange}
              color="primary"
            >
              <ToggleButton value="picture">图片</ToggleButton>
              <ToggleButton value="video">视频</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ mb: 3, textAlign: 'right' }}>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={handleReset}
              sx={{ textTransform: 'none' }}
            >
              重置选项
            </Button>
          </Box>

          <Stack spacing={2} sx={{ mb: 4 }}>
            {options.map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={selectedOptions.includes(option)}
                    onChange={() => handleOptionToggle(option)}
                    color="primary"
                  />
                }
                label={option}
              />
            ))}
          </Stack>

          <Box sx={{ textAlign: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleStart}>
              开始识别
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default App;
