
interface IFunctionInLine {
    functionToCall: (...args: any[]) => Promise<unknown>;
    args: any[];
    resolve: (value: unknown) => void;
    reject: (reason: unknown) => void;
}

class Throtler {
    private executionLine: IFunctionInLine[] = [];
    private isRunning = false;
    
    public callFunction(functionToCall: () => Promise<unknown>, ...args: any[]): Promise<unknown> {
        return new Promise((resolve, reject) => {
            this.executionLine.push({
                resolve,
                reject,
                functionToCall,
                args,
            });
            this.tryNext();
        });
    }

    private tryNext(): void {
        if (!this.executionLine.length) {
            return;
        } else if (!this.isRunning) {
            const { resolve, reject, functionToCall, args} = this.executionLine.shift() as IFunctionInLine;
            this.isRunning = true;
            let req = functionToCall(...args);
            req.then((res: any) => resolve(res))
                .catch((err: any) => reject(err))
                .finally(() => {
                    this.isRunning = false;
                    this.tryNext();
                });
        }
    }
}

export default Throtler;