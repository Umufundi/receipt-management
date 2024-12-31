// Configuration
const config = {
    dropboxAccessToken: 'sl.u.AFcn073Lj2pjH7CfYHRffjv8df78rkbMTynjw_gYe8I8HPu1sJX-39t1eY53o8nvZX54D_wP-96HSrwxH2tBOtAXSQ5ykImllQK-0YjtMlo9q5usxyZ_E1Okg7BD25oTyV9apk710Fao3t8j1N9o3x-dEpxhDE30exqqgY4aY6aaoIuZTW9KqyPBZsyrfe5Qfo_cw_KhP3pnO2fySwcJ7iAzY4Rx-HQw0-4nlSVpl_x4C95l_r5_TxjySqo37srUkWs-i-o-WggVvYwy1NKtq3E9M9leA3Mv0HCJ7MXmPEcr1yk6sPMuFUOF3_PNEX_qe6EuMMr3ZoKMSJEad1QmDMAfqLRdWAHu3QCnLaGnlngcES2V-mdWq2fBWBaOaIf6xA69cmJbNkhNZifbm2ysystjpauPWCGK5f8Ow8iydhHMvbCeMNX646_63z66OdFTKoW-4FTf0R80nTAek3GMxxg1o7mErMxtxqk8Ggoph4A6p2uZekwNj5_ZS6C-yi5H6w_r5QIZPss0-RjqO93f9s1S230zsmd-9RlM6u_Q39pLmjqGEJZITorzPyNGw9dy8AR56edxLQSB9GJyhTodF3B5bC_P_r4Dk1iY_cdFvmRA-B50VCSIRP3c3fuRaD29IMGdhCRv45KPHNT5-J0yueMwz-Ma084GkPTLxunfc9ieseqov07bNWi2kBKCPoSiAetlyUJ5qkwu7o5QtgmU0GwFhPpNWjp-jIm6VgxgfT9C-iRG5jYPtYIR_ESPLNJc4kYJwwHTmCmhYMBtj-nluAyI8hWiB4HAxGOBMReSln_IgzBn1qQLFSVkWDDWlV-wR6mEPUrnNpf3JvDvHAzt6RzCKS-nW9J4fM851eGD967ueLUI_iZDcupn1M96Lm1QvTXoi05OFW84P1yFWHE5CMr7vqGktsjlmWyzTrh_LGCxtiUQLo4VaF-6v12g2EZfkLfpSAd283ijqfjkN3K9bYX4vK7fiOEkbeySmOimrWl7YRbwTvzmymkcl-8xs8ICUwYtlcTEQoQS8OlTkl5dU_OmWWMwnHC28lLmmRyBhRHfG8xAEBMapfE9RdI1oUo3YdwoMhG35yOzdd5LXV9Bj3sXS_7aUqMAaVnehegA60pWffE5JwMl-cUUypKQh01au1oPWnVlCCiXzlMQhev-NVpPGXx2cPspi6RF0YLkbmejxKiF1Ol4n7-Rw90QNW1tonhFmGMCL76OWWV6th1l_S_F14fnsBmF7n-tD2T6rT-zr_-E5_IE1bXqRNb5Zl9y5zmuOqFwCiJ46mCcKKrLACbt57YM4MwjViqXOISrGkT1A1AS8V7bvVDfKziUE7HZa3W6JEUkXLj83Asy6O9LxSvSbTLTshQZ_aC6izFP8IGIcASSQw3Su6sAVli6bNeK_5m5HgYgYGNex2sU79lzV2WvxGQ6F8HOruelMM6Ekybe9HvBStFDB4oGT7QvlNAjjlKoIjEgxosCDTE4Gbxn0VAO',
    uploadEndpoint: 'https://content.dropboxapi.com/2/files/upload'
};

// DOM Elements
const form = document.getElementById('uploadForm');
const imageInput = document.getElementById('receiptImage');
const imagePreview = document.getElementById('imagePreview');
const submitBtn = document.getElementById('submitBtn');
const statusDiv = document.getElementById('status');

// Image preview functionality
imageInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Form submission
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!config.dropboxAccessToken) {
        showStatus('Dropbox access token not configured. Please contact administrator.', 'error');
        return;
    }

    const formData = {
        receiptDate: document.getElementById('receiptDate').value,
        vendorName: document.getElementById('vendorName').value,
        amount: document.getElementById('amount').value,
        expenseType: document.getElementById('expenseType').value,
        receiptImage: imageInput.files[0]
    };

    // Validate form data
    if (!validateForm(formData)) {
        return;
    }

    try {
        submitBtn.disabled = true;
        showStatus('Uploading receipt...', 'info');

        const year = new Date(formData.receiptDate).getFullYear();
        const month = new Date(formData.receiptDate).toLocaleString('default', { month: 'long' });
        const fileName = `${formData.receiptDate}-${formData.vendorName}-${formData.amount}.jpg`;
        const folderPath = `/Receipts/${year}/${month}/${formData.expenseType}`;

        await uploadToDropbox(formData.receiptImage, folderPath, fileName);
        
        showStatus('Receipt uploaded successfully!', 'success');
        form.reset();
        imagePreview.style.display = 'none';
    } catch (error) {
        console.error('Upload error:', error);
        showStatus('Failed to upload receipt. Please try again.', 'error');
    } finally {
        submitBtn.disabled = false;
    }
});

// Validate form data
function validateForm(formData) {
    if (!formData.receiptDate || !formData.vendorName || !formData.amount || 
        !formData.expenseType || !formData.receiptImage) {
        showStatus('Please fill out all fields.', 'error');
        return false;
    }

    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
        showStatus('Please enter a valid amount.', 'error');
        return false;
    }

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (formData.receiptImage.size > maxFileSize) {
        showStatus('Receipt image must be less than 10MB.', 'error');
        return false;
    }

    return true;
}

// Upload file to Dropbox
async function uploadToDropbox(file, folderPath, fileName) {
    const response = await fetch(config.uploadEndpoint, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.dropboxAccessToken}`,
            'Dropbox-API-Arg': JSON.stringify({
                path: `${folderPath}/${fileName}`,
                mode: 'add',
                autorename: true,
            }),
            'Content-Type': 'application/octet-stream',
        },
        body: file
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.error_summary || 'Upload failed');
    }

    return response.json();
}

// Show status message
function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status-message ${type}`;
    statusDiv.style.display = 'block';

    if (type === 'success' || type === 'error') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
} 