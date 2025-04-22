import React, { useState, useRef } from 'react';
import Webcam from 'react-webcam';
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
  Stack,
  LinearProgress,
  Container
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import axios from 'axios';

const App = () => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const [mediaType, setMediaType] = useState('picture');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' 或 'camera'

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

  const handleFileUpload = async (file) => {
    setLoading(true);
    setSelectedFile(file);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(selectedOptions));

    try {
      const response = await axios.post('http://localhost:8000/api/v1/detect/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResults(response.data);
    } catch (error) {
      console.error('检测失败:', error);
      alert('检测失败，请检查文件格式或网络连接');
    } finally {
      setLoading(false);
    }
  };

  const captureAndDetect = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    const blob = await fetch(imageSrc).then(res => res.blob());
    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
    handleFileUpload(file);
  };

  const handleReset = () => {
    setMediaType('picture');
    setSelectedOptions([]);
    setSelectedFile(null);
    setResults([]);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, height: '80vh', gap: 3 }}>
        {/* 左侧：上传 & 选项 */}
        <Box sx={{ width: { xs: '100%', md: '30%' }, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            家具识别系统
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
            <Button variant={mode === 'upload' ? 'contained' : 'outlined'} onClick={() => setMode('upload')} startIcon={<UploadFileIcon />}>文件上传</Button>
            <Button variant={mode === 'camera' ? 'contained' : 'outlined'} onClick={() => setMode('camera')} startIcon={<CameraAltIcon />} sx={{ ml: 2 }}>实时摄像头</Button>
          </Box>

          {mode === 'camera' ? (
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ width: '100%', borderRadius: '8px' }} />
              <Button variant="contained" color="secondary" onClick={captureAndDetect} sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>捕获并检测</Button>
            </Box>
          ) : (
            <Box sx={{ border: '2px dashed #ccc', borderRadius: '8px', p: 3, textAlign: 'center', cursor: 'pointer', '&:hover': { borderColor: '#666' } }} onClick={() => fileInputRef.current.click()}>
              <input type="file" ref={fileInputRef} hidden accept="image/*, video/*" onChange={(e) => handleFileUpload(e.target.files[0])} />
              <UploadFileIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography>点击上传或拖放文件</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>支持格式: JPG, PNG, MP4</Typography>
            </Box>
          )}
        </Box>

        {/* 右侧：识别结果 */}
        <Box sx={{ flex: 1, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 3, overflowY: 'auto' }}>
          <Typography variant="h5" gutterBottom>识别结果</Typography>
          {loading ? <LinearProgress /> : results.length > 0 ? results.map((item, index) => (
            <Card key={index} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{item.class}</Typography>
                <Typography color="textSecondary">置信度: {(item.confidence * 100).toFixed(1)}%</Typography>
                <Typography variant="body2">坐标: {item.bbox.map(num => num.toFixed(1)).join(', ')}</Typography>
              </CardContent>
            </Card>
          )) : <Typography color="textSecondary">暂无结果</Typography>}
        </Box>
      </Box>
    </Container>
  );
};

export default App;
