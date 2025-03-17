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
  const [selectedFile, setSelectedFile] = useState(null);

  const options = ['Option1', 'Option2', 'Option3', 'Option4', 'Option5', 'Option6'];

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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleReset = () => {
    setMediaType('picture');
    setSelectedOptions([]);
    setSelectedFile(null);
  };

  const handleStart = () => {
    console.log('提交参数:', { mediaType, selectedOptions, selectedFile });
    // TODO: 在此处添加API调用
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', p: 3, bgcolor: '#f0f2f5' }}>
      {/* 左侧上传和选项部分 */}
      <Box sx={{ width: '30%', p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          请选择类型
        </Typography>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
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
        
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
        </Box>
        
        <Box sx={{ textAlign: 'center', mb: 2, height: 150, border: '1px solid #ccc', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#e0e0e0' }}>
          {selectedFile ? (
            <Typography variant="body2">{selectedFile.name}</Typography>
          ) : (
            <Typography variant="body2">预览区域</Typography>
          )}
        </Box>
        
        <Stack spacing={1} sx={{ mb: 2 }}>
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
        
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Button variant="outlined" startIcon={<RestartAltIcon />} onClick={handleReset}>
            重置
          </Button>
        </Box>
        
        <Box sx={{ textAlign: 'center' }}>
          <Button variant="contained" color="primary" onClick={handleStart}>
            开始识别
          </Button>
        </Box>
      </Box>

      {/* 右侧识别结果部分 */}
      <Box sx={{ flex: 1, ml: 3, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          识别结果
        </Typography>
      </Box>
    </Box>
  );
};

export default App;