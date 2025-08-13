import { _decorator, Component, Label } from 'cc';
const { ccclass, property } = _decorator;

declare const liff: any; // 宣告全域變數

@ccclass('LoginManager')
export class LoginManager extends Component {

    @property(Label)
    userNameLabel: Label | null = null;

    async start() {
        await this.initLIFF();
    }

    async initLIFF() {
        try {
            // TODO: 換成你在 LINE Developer 取得的 LIFF ID
            await liff.init({ liffId: "YOUR_LIFF_ID" });

            if (!liff.isLoggedIn()) {
                liff.login();
                return;
            }

            const profile = await liff.getProfile();
            console.log("使用者資料:", profile);

            if (this.userNameLabel) {
                this.userNameLabel.string = `Hello, ${profile.displayName}`;
            }

            // 取得 idToken（傳給後端驗證用）
            const idToken = liff.getIDToken();
            console.log("ID Token:", idToken);

        } catch (err) {
            console.error("LIFF 初始化失敗", err);
        }
    }
}
