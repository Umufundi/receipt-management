import requests
import json
from datetime import datetime

# Dropbox access token
DROPBOX_TOKEN = "sl.u.AFcn073Lj2pjH7CfYHRffjv8df78rkbMTynjw_gYe8I8HPu1sJX-39t1eY53o8nvZX54D_wP-96HSrwxH2tBOtAXSQ5ykImllQK-0YjtMlo9q5usxyZ_E1Okg7BD25oTyV9apk710Fao3t8j1N9o3x-dEpxhDE30exqqgY4aY6aaoIuZTW9KqyPBZsyrfe5Qfo_cw_KhP3pnO2fySwcJ7iAzY4Rx-HQw0-4nlSVpl_x4C95l_r5_TxjySqo37srUkWs-i-o-WggVvYwy1NKtq3E9M9leA3Mv0HCJ7MXmPEcr1yk6sPMuFUOF3_PNEX_qe6EuMMr3ZoKMSJEad1QmDMAfqLRdWAHu3QCnLaGnlngcES2V-mdWq2fBWBaOaIf6xA69cmJbNkhNZifbm2ysystjpauPWCGK5f8Ow8iydhHMvbCeMNX646_63z66OdFTKoW-4FTf0R80nTAek3GMxxg1o7mErMxtxqk8Ggoph4A6p2uZekwNj5_ZS6C-yi5H6w_r5QIZPss0-RjqO93f9s1S230zsmd-9RlM6u_Q39pLmjqGEJZITorzPyNGw9dy8AR56edxLQSB9GJyhTodF3B5bC_P_r4Dk1iY_cdFvmRA-B50VCSIRP3c3fuRaD29IMGdhCRv45KPHNT5-J0yueMwz-Ma084GkPTLxunfc9ieseqov07bNWi2kBKCPoSiAetlyUJ5qkwu7o5QtgmU0GwFhPpNWjp-jIm6VgxgfT9C-iRG5jYPtYIR_ESPLNJc4kYJwwHTmCmhYMBtj-nluAyI8hWiB4HAxGOBMReSln_IgzBn1qQLFSVkWDDWlV-wR6mEPUrnNpf3JvDvHAzt6RzCKS-nW9J4fM851eGD967ueLUI_iZDcupn1M96Lm1QvTXoi05OFW84P1yFWHE5CMr7vqGktsjlmWyzTrh_LGCxtiUQLo4VaF-6v12g2EZfkLfpSAd283ijqfjkN3K9bYX4vK7fiOEkbeySmOimrWl7YRbwTvzmymkcl-8xs8ICUwYtlcTEQoQS8OlTkl5dU_OmWWMwnHC28lLmmRyBhRHfG8xAEBMapfE9RdI1oUo3YdwoMhG35yOzdd5LXV9Bj3sXS_7aUqMAaVnehegA60pWffE5JwMl-cUUypKQh01au1oPWnVlCCiXzlMQhev-NVpPGXx2cPspi6RF0YLkbmejxKiF1Ol4n7-Rw90QNW1tonhFmGMCL76OWWV6th1l_S_F14fnsBmF7n-tD2T6rT-zr_-E5_IE1bXqRNb5Zl9y5zmuOqFwCiJ46mCcKKrLACbt57YM4MwjViqXOISrGkT1A1AS8V7bvVDfKziUE7HZa3W6JEUkXLj83Asy6O9LxSvSbTLTshQZ_aC6izFP8IGIcASSQw3Su6sAVli6bNeK_5m5HgYgYGNex2sU79lzV2WvxGQ6F8HOruelMM6Ekybe9HvBStFDB4oGT7QvlNAjjlKoIjEgxosCDTE4Gbxn0VAO"

def test_dropbox_connection():
    print("Testing Dropbox connection...")
    
    # Create a test text file
    test_content = f"Test file created at {datetime.now()}"
    
    # Headers for the upload request
    headers = {
        "Authorization": f"Bearer {DROPBOX_TOKEN}",
        "Dropbox-API-Arg": json.dumps({
            "path": "/test_connection.txt",
            "mode": "add",
            "autorename": True
        }),
        "Content-Type": "application/octet-stream"
    }
    
    try:
        # Upload the test file
        response = requests.post(
            "https://content.dropboxapi.com/2/files/upload",
            headers=headers,
            data=test_content.encode()
        )
        
        if response.status_code == 200:
            print("✓ Successfully connected to Dropbox!")
            print("✓ Test file uploaded successfully")
            print(f"Response: {response.json()}")
        else:
            print("✗ Failed to upload test file")
            print(f"Status code: {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print("✗ Error occurred:")
        print(e)

if __name__ == "__main__":
    test_dropbox_connection() 