/* ================================================================
   PLC SERVICE
   Communication ADS entre TwinCAT HMI et le PLC.

   Responsabilités :
   - lire les Server Symbols ;
   - surveiller les changements de valeurs ;
   - écrire les commandes vers le PLC ;
   - libérer proprement les abonnements.

   Aucune logique machine n'est exécutée ici.
   ================================================================ */

export class PlcService {

    private readonly symbols: Array<TcHmi.Symbol<any>> = [];
    private readonly watchDestroyers: Array<() => void> = [];


    /* ============================================================
       SURVEILLANCE D'UN SYMBOLE PLC
       ============================================================ */

    public watch<T>(
        expression: string,
        label: string,
        callback: (value: T | undefined) => void,
    ): void {

        const symbol = new TcHmi.Symbol<T>(expression);

        this.symbols.push(symbol);

        const destroyWatch = symbol.watch((data) => {

            if (data.error !== TcHmi.Errors.NONE) {
                console.error(
                    `Erreur ADS — ${label}`,
                    data.error,
                );
                return;
            }

            callback(data.value);
        });

        this.watchDestroyers.push(destroyWatch);
    }


    /* ============================================================
       ÉCRITURE D'UN BOOLÉEN VERS LE PLC
       ============================================================ */

    public writeBool(
        expression: string,
        value: boolean,
    ): void {

        TcHmi.Symbol.writeEx<boolean>(
            expression,
            value,
            (data) => {

                if (data.error !== TcHmi.Errors.NONE) {
                    console.error(
                        `Erreur écriture ADS — ${expression}`,
                        data.error,
                    );
                }
            },
        );
    }


    /* ============================================================
       LIBÉRATION DES RESSOURCES
       ============================================================ */

    public destroy(): void {

        for (const destroyWatch of this.watchDestroyers) {
            try {
                destroyWatch();
            } catch (error) {
                console.warn(
                    'Erreur lors de la libération d’un abonnement ADS',
                    error,
                );
            }
        }

        this.watchDestroyers.length = 0;


        for (const symbol of this.symbols) {
            try {
                symbol.destroy();
            } catch (error) {
                console.warn(
                    'Erreur lors de la destruction d’un symbole ADS',
                    error,
                );
            }
        }

        this.symbols.length = 0;
    }
}