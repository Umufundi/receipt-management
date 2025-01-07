// Dropbox Configuration
window.dropboxConfig = {
    accessToken: 'sl.CEGOlrFoSvF-vWjesIymYvxBs7HaqV5OZRxN7B5hp9C5U_tXPBV7g6bKEwIVMZ8OWdwuCGSPsWC6gBqx2t4ijmdWE5SxGLuCNbbRa27sImdkxOAmYLO5Dto-omBcjuqIwfTvwS9IId4geOY',
    lastUpdated: '2025-01-07T11:18:48.178330-05:00',
    expiryHours: 4
};

// Configuration
const config = {
    uploadEndpoint: 'https://content.dropboxapi.com/2/files/upload'
};

// Add token check function
async function checkTokenValidity() {
    if (!window.dropboxConfig?.accessToken) {
        console.error('Dropbox configuration not found!');
        showTokenExpirationWarning('Dropbox configuration is missing. Please contact the administrator.');
        return false;
    }

    try {
        const response = await fetch('https://api.dropboxapi.com/2/users/get_current_account', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${window.dropboxConfig.accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            if (data?.error_summary?.includes('expired_access_token')) {
                showTokenExpirationWarning();
                return false;
            }
        }
        return true;
    } catch (error) {
        console.error('Token check failed:', error);
        return false;
    }
}

// Add warning display
function showTokenExpirationWarning(message = 'The Dropbox connection has expired. Please contact the administrator to refresh the token.') {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'token-warning';
    warningDiv.innerHTML = `
        <div class="warning-content">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
        </div>
    `;
    document.body.insertBefore(warningDiv, document.body.firstChild);
}

// Add CSS for warning
const style = document.createElement('style');
style.textContent = `
    .token-warning {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background-color: #fff3cd;
        color: #856404;
        padding: 1rem;
        text-align: center;
        z-index: 1000;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .warning-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
    }
    .warning-content i {
        font-size: 1.25rem;
    }
`;
document.head.appendChild(style);

// Check token on page load
window.addEventListener('load', checkTokenValidity);

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
                'Authorization': `Bearer ${window.dropboxConfig.accessToken}`,
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
        showError(businessPurposeElement, 'Please enter the business purpose');
        errors.set('businessPurpose', 'Please enter the business purpose');
    }

    return { isValid, errors };
}

// Show error message for an input
function showError(inputElement, message) {
    inputElement.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    inputElement.parentNode.appendChild(errorDiv);
}

// Handle form submission
if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Check token validity before proceeding
        if (!await checkTokenValidity()) {
            return;
        }

        const formData = {
            receiptImage: imageInput.files[0],
            amount: document.getElementById('amount').value,
            date: document.getElementById('date').value,
            expenseType: expenseTypeSelect.value,
            customExpense: customExpenseInput.value,
            businessPurpose: document.getElementById('businessPurpose').value
        };

        const { isValid, errors } = validateForm(formData);

        if (!isValid) {
            console.log('Form validation failed:', errors);
            return;
        }

        try {
            const file = formData.receiptImage;
            const expenseCategory = formData.expenseType === 'custom' ? formData.customExpense : formData.expenseType;
            const folderPath = `/${expenseCategory}`;
            const fileName = `Receipt_${formData.date}_${formData.amount}.${file.name.split('.').pop()}`;

            const uploadResult = await uploadToDropbox(file, folderPath, fileName);
            console.log('Upload successful:', uploadResult);

            // Show success modal
            if (successModal) {
                successModal.style.display = 'block';
            }

            // Reset form
            form.reset();
            if (previewContainer) {
                previewContainer.style.display = 'none';
            }
            if (imagePreview) {
                imagePreview.src = '#';
            }
            if (customExpenseGroup) {
                customExpenseGroup.style.display = 'none';
            }

        } catch (error) {
            console.error('Upload failed:', error);
            alert(`Upload failed: ${error.message}`);
        }
    });
}

// Close modal when clicking close button or outside
if (closeModal) {
    closeModal.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
}

if (modalButton) {
    modalButton.addEventListener('click', function() {
        successModal.style.display = 'none';
    });
}

window.addEventListener('click', function(e) {
    if (e.target === successModal) {
        successModal.style.display = 'none';
    }
});

// Show/hide custom expense input based on expense type selection
if (expenseTypeSelect) {
    expenseTypeSelect.addEventListener('change', function() {
        if (customExpenseGroup) {
            customExpenseGroup.style.display = this.value === 'custom' ? 'block' : 'none';
        }
        if (this.value !== 'custom') {
            customExpenseInput.value = '';
        }
    });
} 