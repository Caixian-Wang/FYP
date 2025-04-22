import React, { useState, useRef, useEffect } from 'react';
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
  Container,
  Paper,
  IconButton
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

const App = () => {
  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  const [mediaType, setMediaType] = useState('picture'); // 'picture' 或 'video'
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('upload'); // 'upload' 或 'camera'

  const options = ['Option1', 'Option2', 'Option3', 'Option4', 'Option5', 'Option6'];

  // 切换到预览区
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [mediaType]);

  const handleTypeChange = (_, newType) => {
    if (newType) {
      setMediaType(newType);
      // 重置状态
      setSelectedFile(null);
      setPreviewUrl(null);
      setResults([]);
    }
  };

  const handleOptionToggle = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
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
    handleFileSelect(file);
  };

  const handleReset = () => {
    setMediaType('picture');
    setSelectedOptions([]);
    setSelectedFile(null);
    setPreviewUrl(null);
    setResults([]);
  };

  const renderPreviewArea = () => {
    if (mediaType === 'video') {
      return (
        <Box sx={{ position: 'relative', mb: 2 }} ref={previewRef}>
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={{
              width: '100%',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={captureAndDetect}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            捕获并检测
          </Button>
        </Box>
      );
    }

    return (
      <Box
        ref={previewRef}
        sx={{
          border: '2px dashed rgba(25, 118, 210, 0.4)',
          borderRadius: '16px',
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          position: 'relative',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.6)',
          backdropFilter: 'blur(8px)',
          '&:hover': {
            borderColor: '#1976d2',
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
          }
        }}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept={mediaType === 'picture' ? "image/*" : "video/*"}
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />
        {previewUrl ? (
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            {mediaType === 'picture' ? (
              <img
                src={previewUrl}
                alt="预览"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
            ) : (
              <video
                src={previewUrl}
                controls
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
              />
            )}
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                setPreviewUrl(null);
                setSelectedFile(null);
              }}
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(4px)',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)'
                }
              }}
            >
              <CloseIcon sx={{ color: 'white' }} />
            </IconButton>
          </Box>
        ) : (
          <>
            <UploadFileIcon sx={{ 
              fontSize: 64, 
              mb: 2, 
              color: '#1976d2',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }} />
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 1,
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              点击上传{mediaType === 'picture' ? '图片' : '视频'}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                textShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              支持格式: {mediaType === 'picture' ? 'JPG, PNG' : 'MP4'}
            </Typography>
          </>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: `url(${process.env.PUBLIC_URL}/background.jfif)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={8}
          sx={{
            p: 5,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            minHeight: '85vh',
            maxHeight: '95vh',
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography
            variant="h3"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 5,
              textShadow: '2px 2px 4px rgba(0,0,0,0.08)'
            }}
          >
            家具识别系统
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, height: 'calc(85vh - 120px)' }}>
            {/* 左侧：上传 & 选项 */}
            <Paper
              elevation={4}
              sx={{
                width: { xs: '100%', md: '35%' },
                p: 4,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <ToggleButtonGroup
                  value={mediaType}
                  exclusive
                  onChange={handleTypeChange}
                  color="primary"
                  size="large"
                  sx={{
                    mb: 2,
                    '& .MuiToggleButton-root': {
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem',
                      borderRadius: '12px',
                      border: '2px solid #1976d2',
                      '&.Mui-selected': {
                        background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                        color: 'white',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                        }
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.08)'
                      },
                      '&:first-of-type': {
                        borderTopLeftRadius: '12px',
                        borderBottomLeftRadius: '12px'
                      },
                      '&:last-of-type': {
                        borderTopRightRadius: '12px',
                        borderBottomRightRadius: '12px'
                      }
                    }
                  }}
                >
                  <ToggleButton value="picture">图片识别</ToggleButton>
                  <ToggleButton value="video">视频识别</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {renderPreviewArea()}
            </Paper>

            {/* 右侧：识别结果 */}
            <Paper
              elevation={4}
              sx={{
                flex: 1,
                p: 4,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                overflowY: 'auto',
                maxHeight: '100%',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 3
                }}
              >
                识别结果
              </Typography>
              {loading ? (
                <Box sx={{ width: '100%', mt: 2 }}>
                  <LinearProgress 
                    sx={{ 
                      height: 10, 
                      borderRadius: 5,
                      backgroundColor: 'rgba(25, 118, 210, 0.1)',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(45deg, #1976d2, #2196f3)'
                      }
                    }} 
                  />
                </Box>
              ) : results.length > 0 ? (
                <Stack spacing={2}>
                  {results.map((item, index) => (
                    <Card
                      key={index}
                      sx={{
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        border: '1px solid rgba(25, 118, 210, 0.1)',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 'bold',
                            background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                          }}
                        >
                          {item.class}
                        </Typography>
                        <Typography
                          sx={{
                            mb: 1,
                            color: 'text.secondary',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          置信度: 
                          <Box
                            sx={{
                              px: 2,
                              py: 0.5,
                              borderRadius: 2,
                              backgroundColor: 'rgba(25, 118, 210, 0.1)',
                              color: '#1976d2',
                              fontWeight: 'bold'
                            }}
                          >
                            {(item.confidence * 100).toFixed(1)}%
                          </Box>
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary',
                            backgroundColor: 'rgba(0, 0, 0, 0.02)',
                            p: 1,
                            borderRadius: 1,
                            fontFamily: 'monospace'
                          }}
                        >
                          坐标: {item.bbox.map(num => num.toFixed(1)).join(', ')}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Box
                  sx={{
                    py: 8,
                    textAlign: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 2,
                    border: '1px dashed rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <Typography
                    color="text.secondary"
                    sx={{
                      fontStyle: 'italic'
                    }}
                  >
                    暂无结果
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default App;
