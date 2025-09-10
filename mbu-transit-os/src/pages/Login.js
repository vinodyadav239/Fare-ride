import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'student'
  });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isLogin) {
        result = await login(formData);
      } else {
        // For registration, add required fields
        const registrationData = {
          ...formData,
          name: formData.name || formData.email.split('@')[0],
          phone: formData.phone || '',
          ...(formData.userType === 'student' && { studentId: formData.studentId || '' }),
          ...(formData.userType === 'driver' && { 
            vehicleNumber: formData.vehicleNumber || '',
            licenseNumber: formData.licenseNumber || ''
          })
        };
        result = await register(registrationData);
      }

      if (result.success) {
        const routes = {
          student: '/student',
          driver: '/driver',
          admin: '/admin'
        };
        navigate(routes[formData.userType] || '/student');
      } else {
        setError(result.error || 'Authentication failed');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({
      email: '',
      password: '',
      userType: 'student',
      name: '',
      phone: '',
      studentId: '',
      vehicleNumber: '',
      licenseNumber: ''
    });
  };

  return React.createElement('div', {
    className: 'login-container'
  }, [
    React.createElement('div', {
      key: 'login-container',
      className: 'login-form'
    }, [
      React.createElement('div', {
        key: 'header',
        className: 'login-header'
      }, [
        React.createElement('div', {
          key: 'logo',
          className: 'login-logo'
        }, [
          React.createElement('span', {
            key: 'logo-icon',
            className: 'login-logo-icon'
          }, '🚌')
        ]),
        React.createElement('h2', {
          key: 'title',
          className: 'login-title'
        }, isLogin ? 'MBU Transit OS' : 'Join MBU Transit'),
        React.createElement('p', {
          key: 'subtitle',
          className: 'login-subtitle'
        }, isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started')
      ]),
      
      error && React.createElement('div', {
        key: 'error',
        className: 'error-message'
      }, [
        React.createElement('div', {
          key: 'error-icon',
          className: 'error-content'
        }, [
          React.createElement('span', {
            key: 'error-emoji',
            className: 'error-icon'
          }, '⚠️'),
          React.createElement('span', {
            key: 'error-text'
          }, error)
        ])
      ]),

      React.createElement('form', {
        key: 'form',
        onSubmit: handleSubmit,
        className: 'space-y-4'
      }, [
        React.createElement('div', {
          key: 'user-type',
          className: 'form-group'
        }, [
          React.createElement('label', {
            key: 'user-type-label',
            className: 'form-label'
          }, 'User Type'),
          React.createElement('select', {
            key: 'user-type-select',
            name: 'userType',
            value: formData.userType,
            onChange: handleChange,
            className: 'form-select'
          }, [
            React.createElement('option', { key: 'student', value: 'student' }, 'Student'),
            React.createElement('option', { key: 'driver', value: 'driver' }, 'Driver'),
            React.createElement('option', { key: 'admin', value: 'admin' }, 'Admin')
          ])
        ]),

        !isLogin && React.createElement('div', {
          key: 'name',
          className: 'form-group'
        }, [
          React.createElement('label', {
            key: 'name-label',
            className: 'form-label'
          }, 'Full Name'),
          React.createElement('input', {
            key: 'name-input',
            type: 'text',
            name: 'name',
            value: formData.name || '',
            onChange: handleChange,
            required: !isLogin,
            className: 'form-input'
          })
        ]),

        React.createElement('div', {
          key: 'email',
          className: 'form-group'
        }, [
          React.createElement('label', {
            key: 'email-label',
            className: 'form-label'
          }, 'Email'),
          React.createElement('input', {
            key: 'email-input',
            type: 'email',
            name: 'email',
            value: formData.email,
            onChange: handleChange,
            required: true,
            className: 'form-input'
          })
        ]),

        React.createElement('div', {
          key: 'password',
          className: 'form-group'
        }, [
          React.createElement('label', {
            key: 'password-label',
            className: 'form-label'
          }, 'Password'),
          React.createElement('input', {
            key: 'password-input',
            type: 'password',
            name: 'password',
            value: formData.password,
            onChange: handleChange,
            required: true,
            className: 'form-input'
          })
        ]),

        !isLogin && formData.userType === 'student' && React.createElement('div', {
          key: 'student-id'
        }, [
          React.createElement('label', {
            key: 'student-id-label',
            className: 'block text-sm font-medium text-gray-700 mb-2'
          }, 'Student ID (optional)'),
          React.createElement('input', {
            key: 'student-id-input',
            type: 'text',
            name: 'studentId',
            value: formData.studentId || '',
            onChange: handleChange,
            className: 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          })
        ]),

        !isLogin && formData.userType === 'driver' && React.createElement('div', {
          key: 'driver-fields'
        }, [
          React.createElement('div', {
            key: 'vehicle-number'
          }, [
            React.createElement('label', {
              key: 'vehicle-number-label',
              className: 'block text-sm font-medium text-gray-700 mb-2'
            }, 'Vehicle Number (optional)'),
            React.createElement('input', {
              key: 'vehicle-number-input',
              type: 'text',
              name: 'vehicleNumber',
              value: formData.vehicleNumber || '',
              onChange: handleChange,
              className: 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            })
          ]),
          React.createElement('div', {
            key: 'license-number'
          }, [
            React.createElement('label', {
              key: 'license-number-label',
              className: 'block text-sm font-medium text-gray-700 mb-2'
            }, 'License Number (optional)'),
            React.createElement('input', {
              key: 'license-number-input',
              type: 'text',
              name: 'licenseNumber',
              value: formData.licenseNumber || '',
              onChange: handleChange,
              className: 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            })
          ])
        ]),

        React.createElement('button', {
          key: 'submit',
          type: 'submit',
          disabled: loading,
          className: `submit-button ${loading ? 'disabled' : ''}`
        }, [
          loading ? [
            React.createElement('div', {
              key: 'loading-spinner',
              className: 'loading-spinner'
            }),
            'Please wait...'
          ] : [
            React.createElement('span', {
              key: 'button-icon',
              className: 'mr-2'
            }, isLogin ? '🔑' : '✨'),
            isLogin ? 'Sign In' : 'Create Account'
          ]
        ]),

        React.createElement('div', {
          key: 'toggle',
          className: 'toggle-section'
        }, [
          React.createElement('span', {
            key: 'toggle-text',
            className: 'toggle-text'
          }, isLogin ? "Don't have an account? " : "Already have an account? "),
          React.createElement('button', {
            key: 'toggle-button',
            type: 'button',
            onClick: toggleMode,
            className: 'toggle-button'
          }, isLogin ? 'Register' : 'Login')
        ])
      ])
    ])
  ]);
};

export default Login;
