using NUnit.Framework;

namespace EthGame.Core.Tests
{
    public class StatsSystemTests
    {
        [Test]
        public void ApplyChange_AddsXp()
        {
            var stats = new StatsSystem(new[] { 100, 250 });

            StatsSystem.ChangeResult result = stats.ApplyChange(Stat.XP, 40);

            Assert.IsTrue(result.Changed);
            Assert.AreEqual(40, stats.GetValue(Stat.XP));
            Assert.AreEqual(1, stats.GetValue(Stat.Level));
        }

        [Test]
        public void ApplyChange_XpCrossesTwoThresholds()
        {
            var stats = new StatsSystem(new[] { 100, 250, 500 });

            StatsSystem.ChangeResult result = stats.ApplyChange(Stat.XP, 300);

            CollectionAssert.AreEqual(new[] { 2, 3 }, result.LevelsGained);
            Assert.AreEqual(300, stats.GetValue(Stat.XP));
            Assert.AreEqual(3, stats.GetValue(Stat.Level));
        }

        [Test]
        public void ApplyChange_MoneyNeverGoesNegative()
        {
            var stats = new StatsSystem(new[] { 100 });
            stats.ApplyChange(Stat.Money, 5);

            StatsSystem.ChangeResult result = stats.ApplyChange(Stat.Money, -8);

            Assert.IsTrue(result.Changed);
            Assert.AreEqual(0, stats.GetValue(Stat.Money));
        }
    }
}