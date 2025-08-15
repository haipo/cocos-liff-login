import { _decorator, Component, director,Button,EventHandler, RichText  } from 'cc';
import { globals, UserProfile } from './Globals';
const { ccclass, property } = _decorator;

declare const liff: any;
const project_LIFF_ID = '';

@ccclass('LoginManager')
export class LoginManager extends Component {

    //登入按鈕
    @property(Button)
    btn_login: Button | null = null;

    @property(RichText)
    userId_text :RichText | null = null;

    @property(RichText)
    displayName_text :RichText | null = null;

    @property(Node)
    pictureUrl_image :Node | null = null;

    onLoad () {
        this.btn_login.node.on(Button.EventType.CLICK, this.login_click, this);
    }
    login_click (button: Button) {
        console.log("Login button click");        
        if (!liff.isLoggedIn()) {
            liff.login();
            return;
        }
    }

    start() {
        this.bootstrap();
    }

    private shouldMock(): boolean {
        try {
            const params = new URLSearchParams(globalThis.location?.search || '');
            if (params.get('mock') === '1' || params.get('debug') === '1') return true;
            // Local/HTTP preview often lacks HTTPS + LINE context
            const isHttps = globalThis.location?.protocol === 'https:';
            return !isHttps;
        } catch {
            return false;
        }
    }

    private async bootstrap() {
        if (this.shouldMock()) {
            this.mockLogin();
            return;
        }
        await this.initLIFF();
    }

    private mockLogin() {
        const mock: UserProfile = {
            userId: 'mock-user-123',
            displayName: 'Mock User',            
            pictureUrl: ''
        };
        console.warn('[LIFF] 使用模擬登入 (mock)');
        globals.userProfile = mock;
        this.userId_text.string = mock.userId;
        this.displayName_text.string = mock.displayName;
        director.loadScene('main');
    }

    private async initLIFF() {
        try {
            if (typeof (globalThis as any).liff === 'undefined') {
                throw new Error('LIFF SDK 未載入');
            }

            // TODO: 換成你在 LINE Developer 取得的 LIFF ID
            await liff.init({ liffId: project_LIFF_ID });

            if (!liff.isLoggedIn()) {
                liff.login();
                return;
            }

            const profile = await liff.getProfile();
            console.log('使用者資料:', profile);

            globals.userProfile = profile as UserProfile;
            director.loadScene('main');
        } catch (err) {
            console.error('LIFF 初始化失敗', err);
            // 提供退路：若需要離線除錯，可用 ?mock=1 啟動
        }
    }
}
