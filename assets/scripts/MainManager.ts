import { _decorator, Component, Label } from 'cc';
import { globals } from './Globals';

const { ccclass, property } = _decorator;

@ccclass('MainManager')
export class MainManager extends Component {

    @property(Label)
    userInfoLabel: Label | null = null;

    start() {
        if (globals.userProfile && this.userInfoLabel) {
            const profile = globals.userProfile;
            this.userInfoLabel.string = `User ID: ${profile.userId}\nDisplay Name: ${profile.displayName}\n}`;
        }
    }
}
