namespace EthGame.Core
{
    /// <summary>
    /// What is currently being played. Set by Core's SceneLoader before loading an arena or
    /// Übung scene, read by W4 / W5 in that scene. Null when not in such a scene.
    /// </summary>
    public static class ActiveSession
    {
        public static BossDefinition Boss { get; set; }
        public static UebungDefinition Uebung { get; set; }

        /// <summary>Scene + spawn point to return to afterwards.</summary>
        public static string ReturnScene { get; set; }
        public static string ReturnSpawnId { get; set; }

        public static void Clear()
        {
            Boss = null;
            Uebung = null;
        }
    }
}
