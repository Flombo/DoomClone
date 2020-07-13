namespace doomClone {

    export class ControlsLoader {

        public getUpKey() : string {
            return localStorage.getItem('UP');
        }

        public getDownKey() : string {
            return localStorage.getItem('DOWN');
        }

        public getLeftKey() : string {
            return localStorage.getItem('LEFT');
        }

        public getRightKey() : string {
            return localStorage.getItem('RIGHT');
        }

        public getShootKey() : string {
            return localStorage.getItem('SHOOT');
        }

        public getSprintKey() : string {
            return localStorage.getItem('SPRINT');
        }

        public getInteractKey() : string {
            return localStorage.getItem('INTERACT');
        }

    }

}