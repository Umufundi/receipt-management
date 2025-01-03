// Configuration
const config = {
    dropboxAccessToken: 'sl.CD1Lwf3p8X8NhBMsH5pujfk08Am2tCKn1odJj3m0GlWuF1NFR3LYyIiB3ptqiVsMUHgRQXSyxW724JydP6SAu_N6iX4YfY1qTtN21GG9XiIQ57ZVvkPIGwVaB4coAWCJIwRfKhOPRcsiGFY',
    uploadEndpoint: 'https://content.dropboxapi.com/2/files/upload'
};

// DOM Elements
const form = document.getElementById('uploadForm');
const imageInput = document.getElementById('receiptImage');
const imagePreview = document.getElementById('imagePreview');
const previewContainer = document.getElementById('previewContainer');
const removePreviewBtn = document.getElementById('removePreview');
const successModal = document.getElementById('successModal');
const closeModal = document.querySelector('.close-modal');
const modalButton = document.querySelector('.modal-button');
const expenseTypeSelect = document.getElementById('expenseType');
const customExpenseGroup = document.getElementById('customExpenseGroup');
const customExpenseInput = document.getElementById('customExpense');

// Handle image selection
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (imagePreview && previewContainer) {
                    imagePreview.src = e.target.result;
                    previewContainer.style.display = 'block';
                }
            };
            reader.onerror = function(error) {
                console.error('Error reading file:', error);
                showError(imageInput, 'Error reading image file. Please try again.');
            };
            reader.readAsDataURL(file);
        } else {
            showError(imageInput, 'Please select an image file.');
            imageInput.value = '';
        }
    }
});

// Remove preview
if (removePreviewBtn) {
    removePreviewBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (imagePreview) {
            imagePreview.src = '#';
        }
        if (previewContainer) {
            previewContainer.style.display = 'none';
        }
        if (imageInput) {
            imageInput.value = '';
        }
    });
}

// Upload file to Dropbox
async function uploadToDropbox(file, folderPath, fileName) {
    try {
        console.log('Starting upload to:', `${folderPath}/${fileName}`);
        
        // Read file content
        const fileContent = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });

        // Format path according to Dropbox requirements
        const dropboxPath = `${folderPath}/${fileName}`
            .replace(/\s+/g, '_')
            .replace(/^\/+/, ''); // Remove leading slashes
        
        console.log('Dropbox path:', dropboxPath);
        console.log('File size:', file.size);
        console.log('File type:', file.type);

        const response = await fetch(config.uploadEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.dropboxAccessToken}`,
                'Dropbox-API-Arg': JSON.stringify({
                    path: '/' + dropboxPath,
                    mode: 'add',
                    autorename: true,
                    mute: false,
                    strict_conflict: false
                }),
                'Content-Type': 'application/octet-stream'
            },
            body: fileContent
        });

        console.log('Response headers:', Object.fromEntries([...response.headers.entries()]));
        console.log('Upload response status:', response.status);
        
        const responseText = await response.text();
        console.log('Upload response:', responseText);

        if (!response.ok) {
            let errorMessage = 'Upload failed';
            try {
                const errorData = JSON.parse(responseText);
                if (errorData?.error_summary?.includes('expired_access_token')) {
                    errorMessage = 'Dropbox token has expired. Please contact administrator.';
                } else if (errorData?.error_summary?.includes('invalid_access_token')) {
                    errorMessage = 'Invalid Dropbox token. Please contact administrator.';
                } else {
                    errorMessage = errorData?.error_summary || 'Upload failed';
                }
            } catch (e) {
                console.error('Error parsing response:', e);
            }
            throw new Error(errorMessage);
        }

        return JSON.parse(responseText);
    } catch (error) {
        console.error('Detailed upload error:', error);
        if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            throw new Error('Network error. Please check your internet connection and try again.');
        }
        throw error;
    }
}

// Add touched class to inputs when user interacts with them
document.querySelectorAll('input, select, textarea').forEach(element => {
    element.addEventListener('blur', function() {
        this.classList.add('touched');
    });
});

// Validate form data
function validateForm(formData) {
    let isValid = true;
    const errors = new Map();

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Required field validation
    Object.entries(formData).forEach(([key, value]) => {
        const element = document.getElementById(key);
        if (element && element.required && !value) {
            isValid = false;
            element.classList.add('touched'); // Mark as touched when validation fails
            showError(element, 'This field is required');
            errors.set(key, 'This field is required');
        }
    });

    // Amount validation
    const amountElement = document.getElementById('amount');
    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        isValid = false;
        amountElement.classList.add('touched');
        showError(amountElement, 'Please enter a valid amount');
        errors.set('amount', 'Please enter a valid amount');
    }

    // Custom expense validation
    if (formData.expenseType === 'custom' && !formData.customExpense.trim()) {
        isValid = false;
        const customExpenseElement = document.getElementById('customExpense');
        customExpenseElement.classList.add('touched');
        showError(customExpenseElement, 'Please enter a custom expense category');
        errors.set('customExpense', 'Please enter a custom expense category');
    }

    // Business purpose validation
    const businessPurposeElement = document.getElementById('businessPurpose');
    if (!formData.businessPurpose.trim()) {
        isValid = false;
        businessPurposeElement.classList.add('touched');
        showError(businessPurposeElement, 'Please enter a business purpose');
        errors.set('businessPurpose', 'Please enter a business purpose');
    }

    // File validation
    if (formData.receiptImage) {
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        if (formData.receiptImage.size > maxFileSize) {
            isValid = false;
            const receiptImageElement = document.getElementById('receiptImage');
            receiptImageElement.classList.add('touched');
            showError(receiptImageElement.parentElement, 'Receipt image must be less than 10MB');
            errors.set('receiptImage', 'Receipt image must be less than 10MB');
        }
    }

    return isValid;
}

// Reset form with validation states
function resetForm() {
    form.reset();
    document.querySelectorAll('.touched').forEach(el => el.classList.remove('touched'));
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

// Show error message for an element
function showError(element, message) {
    element.classList.add('error');
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i>${message}`;
    element.parentElement.appendChild(errorMessage);
}

// Show success message for an element
function showSuccess(element, message) {
    element.classList.add('success');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.innerHTML = `<i class="fas fa-check-circle"></i>${message}`;
    element.parentElement.appendChild(successMessage);
}

// Form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = document.querySelector('.submit-button');
    const originalButtonText = submitButton.innerHTML;

    try {
        if (!config.dropboxAccessToken) {
            showError(submitButton, 'Dropbox access token not configured. Please contact administrator.');
            return;
        }

        // Get form data
        const formData = {
            receiptType: document.querySelector('input[name="receiptType"]:checked').value,
            employeeName: document.getElementById('employeeName').value,
            receiptDate: document.getElementById('receiptDate').value,
            vendorName: document.getElementById('vendorName').value,
            amount: document.getElementById('amount').value,
            paymentMethod: document.getElementById('paymentMethod').value,
            expenseType: document.getElementById('expenseType').value,
            customExpense: document.getElementById('customExpense').value,
            businessPurpose: document.getElementById('businessPurpose').value,
            receiptImage: imageInput.files[0]
        };

        // Mark all fields as touched before validation
        Object.keys(formData).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                element.classList.add('touched');
            }
        });

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Create folder path based on date (2025)
        const date = new Date(formData.receiptDate);
        if (date.getFullYear() < 2025) {
            date.setFullYear(2025);
        }
        const folderPath = `Receipts/${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        
        // Clean up file name
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const fileExt = formData.receiptImage.name.split('.').pop();
        const cleanEmployeeName = formData.employeeName.replace(/[^a-zA-Z0-9]/g, '_');
        const cleanVendorName = formData.vendorName.replace(/[^a-zA-Z0-9]/g, '_');
        const fileName = `${cleanEmployeeName}_${cleanVendorName}_${timestamp}.${fileExt}`;

        console.log('Attempting upload:', {
            folderPath,
            fileName,
            fileSize: formData.receiptImage.size,
            fileType: formData.receiptImage.type
        });

        // Show loading state
        submitButton.classList.add('loading');
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
        submitButton.disabled = true;

        try {
            // Upload to Dropbox
            const uploadResult = await uploadToDropbox(formData.receiptImage, folderPath, fileName);
            console.log('Upload successful:', uploadResult);

            // Show success modal
            successModal.style.display = 'flex';
            
            // Clear form and preview
            resetForm();
            if (previewContainer) {
                previewContainer.style.display = 'none';
                if (imagePreview) {
                    imagePreview.src = '#';
                }
            }
            
        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            let errorMessage = 'Failed to upload receipt. ';
            
            if (uploadError.message.includes('NetworkError') || uploadError.message.includes('Failed to fetch')) {
                errorMessage += 'Please check your internet connection and try again.';
            } else if (uploadError.message.includes('expired_access_token')) {
                errorMessage += 'Access token has expired. Please contact administrator.';
            } else if (uploadError.message.includes('invalid_access_token')) {
                errorMessage += 'Invalid access token. Please contact administrator.';
            } else {
                errorMessage += uploadError.message;
            }
            
            showError(submitButton, errorMessage);
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showError(submitButton, 'An unexpected error occurred. Please try again.');
    } finally {
        // Restore button state
        submitButton.classList.remove('loading');
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
});

// Handle custom expense type
if (expenseTypeSelect) {
    expenseTypeSelect.addEventListener('change', function() {
        if (this.value === 'custom' && customExpenseGroup) {
            customExpenseGroup.style.display = 'block';
            if (customExpenseInput) {
                customExpenseInput.required = true;
            }
        } else if (customExpenseGroup) {
            customExpenseGroup.style.display = 'none';
            if (customExpenseInput) {
                customExpenseInput.required = false;
            }
        }
    });
}

// Close modal handlers
function closeSuccessModal() {
    if (successModal) {
        successModal.style.display = 'none';
    }
}

if (closeModal) {
    closeModal.addEventListener('click', closeSuccessModal);
}

if (modalButton) {
    modalButton.addEventListener('click', closeSuccessModal);
}

// Close modal when clicking outside
if (successModal) {
    successModal.addEventListener('click', function(e) {
        if (e.target === this) {
            closeSuccessModal();
        }
    });
} 