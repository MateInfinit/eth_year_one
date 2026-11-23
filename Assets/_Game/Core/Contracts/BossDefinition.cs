using UnityEngine;

namespace EthGame.Core
{
    /// <summary>Data for one professor fight. Assets are created and owned by W4.</summary>
    [CreateAssetMenu(menuName = "EthGame/Boss Definition", fileName = "Boss_")]
    public class BossDefinition : ScriptableObject
    {
        [Tooltip("lowercase_snake_case, e.g. discrete_math")]
        public string bossId;
        public string displayName;
        public string courseName;
        public Sprite portrait;

        [Header("Requirements & rewards")]
        public int requiredLevel = 1;
        public int ectsReward = 7;
        public int sanityLossOnDefeat = 10;

        [Header("Scenes & audio")]
        [Tooltip("e.g. Arena_discrete_math")]
        public string arenaSceneName;
        public string musicId;

        [Header("Text")]
        [TextArea(2, 5)] public string[] introLines;
        [TextArea(2, 5)] public string[] defeatLines;   // player won
        [TextArea(2, 5)] public string[] victoryLines;  // boss won
    }
}
