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
  IconButton,
  Tooltip
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import axios from 'axios';
import { zh } from './locales/zh';
import { en } from './locales/en';

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
  const [language, setLanguage] = useState('zh');
  const [error, setError] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const t = language === 'zh' ? zh : en;

  const options = ['Option1', 'Option2', 'Option3', 'Option4', 'Option5', 'Option6'];

  // 切换到预览区
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [mediaType]);

  // 添加设备检测
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // 初始检查
    checkDevice();

    // 添加窗口大小变化监听
    window.addEventListener('resize', checkDevice);

    // 清理函数
    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

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
      handleImageUpload(file);
    }
  };

  const handleImageUpload = async (file) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/v1/detect/image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Detection failed');
      }

      const data = await response.json();
      console.log('Detection response:', data);
      setResults(data.detections || []);
      setPreviewUrl(data.annotated_image);
    } catch (err) {
      setError('Failed to process image');
      console.error('Upload error:', err);
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

  const handleLanguageChange = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const getConfidenceColor = (confidence) => {
    const percentage = confidence * 100;
    if (percentage >= 75) return { bg: '#e3f2fd', text: '#1976d2' }; // 蓝色
    if (percentage >= 50) return { bg: '#e8f5e9', text: '#2e7d32' }; // 绿色
    if (percentage >= 25) return { bg: '#fff3e0', text: '#f57c00' }; // 黄色
    return { bg: '#ffebee', text: '#d32f2f' }; // 红色
  };

  const renderResults = (results) => {
    if (!results || results.length === 0) {
      return (
        <Box
          sx={{
            py: 12,
            px: 6,
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.02)',
            borderRadius: 3,
            border: '1px dashed rgba(0, 0, 0, 0.1)',
            minHeight: '200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.03)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
            }
          }}
        >
          <Typography
            color="text.secondary"
            sx={{
              fontStyle: 'italic',
              fontSize: '1.2rem',
              opacity: 0.7
            }}
          >
            {t.noResults}
          </Typography>
        </Box>
      );
    }

    return (
      <Stack spacing={2}>
        {results.map((result, index) => {
          const confidenceColors = getConfidenceColor(result.confidence);
          return (
            <Card
              key={index}
              sx={{
                p: 3,
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
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #1976d2, #2196f3)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                {t.furnitureType}: {result.class_name}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2
                }}
              >
                <Typography>{t.confidence}:</Typography>
                <Box
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    backgroundColor: confidenceColors.bg,
                    color: confidenceColors.text,
                    fontWeight: 'bold'
                  }}
                >
                  {(result.confidence * 100).toFixed(1)}%
                </Box>
              </Box>
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
                {t.coordinates}: [{result.bbox.map(coord => coord.toFixed(1)).join(', ')}]
              </Typography>
            </Card>
          )
        })}
      </Stack>
    );
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
            {t.captureAndDetect}
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
                alt={t.preview}
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
              {t.uploadImage}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                textShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              {t.supportedFormats}: {mediaType === 'picture' ? t.imageFormats : t.videoFormats}
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
        p: isMobile ? 1 : 2
      }}
    >
      <Container maxWidth={isMobile ? 'sm' : 'xl'}>
        <Paper
          elevation={8}
          sx={{
            p: isMobile ? 2 : 5,
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(12px)',
            minHeight: isMobile ? 'auto' : '85vh',
            maxHeight: isMobile ? 'auto' : '95vh',
            overflowY: 'auto',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            position: 'relative'
          }}
        >
          <Tooltip title={language === 'zh' ? 'Switch to English' : '切换到中文'}>
            <IconButton
              onClick={handleLanguageChange}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.2)'
                }
              }}
            >
              <LanguageIcon sx={{ color: '#1976d2' }} />
            </IconButton>
          </Tooltip>

          <Typography
            variant={isMobile ? 'h4' : 'h3'}
            gutterBottom
            align="center"
            sx={{
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #1976d2, #2196f3)',
              backgroundClip: 'text',
              textFillColor: 'transparent',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: isMobile ? 3 : 5,
              textShadow: '2px 2px 4px rgba(0,0,0,0.08)'
            }}
          >
            {t.title}
          </Typography>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            gap: isMobile ? 2 : 4, 
            height: isMobile ? 'auto' : 'calc(85vh - 120px)' 
          }}>
            {/* 左侧：上传 & 选项 */}
            <Paper
              elevation={4}
              sx={{
                width: isMobile ? '100%' : '35%',
                p: isMobile ? 2 : 4,
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
              <Box sx={{ textAlign: 'center', mb: isMobile ? 2 : 4 }}>
                <ToggleButtonGroup
                  value={mediaType}
                  exclusive
                  onChange={handleTypeChange}
                  color="primary"
                  size={isMobile ? 'small' : 'large'}
                  sx={{
                    mb: 2,
                    '& .MuiToggleButton-root': {
                      px: isMobile ? 2 : 4,
                      py: isMobile ? 0.5 : 1.5,
                      fontSize: isMobile ? '0.9rem' : '1.1rem',
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
                  <ToggleButton value="picture">{t.pictureRecognition}</ToggleButton>
                  <ToggleButton value="video">{t.videoRecognition}</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {renderPreviewArea()}
            </Paper>

            {/* 右侧：识别结果 */}
            <Paper
              elevation={4}
              sx={{
                flex: 1,
                p: isMobile ? 2 : 4,
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                overflowY: 'auto',
                maxHeight: isMobile ? 'auto' : '100%',
                border: '1px solid rgba(25, 118, 210, 0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)'
                }
              }}
            >
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
              ) : (
                renderResults(results)
              )}
            </Paper>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default App;
