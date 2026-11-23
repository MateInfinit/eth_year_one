using System.Collections.Generic;
using EthGame.Combat;
using NUnit.Framework;

namespace EthGame.Combat.Tests
{
    public sealed class BossPhaseSelectorTests
    {
        private BossPhaseSelector selector;

        [SetUp]
        public void SetUp()
        {
            selector = new BossPhaseSelector();
        }

        [Test]
        public void SelectPhase_UsesHighestEligibleThreshold()
        {
            List<BossPhase> phases = new List<BossPhase>
            {
                new BossPhase(0.4f, null),
                new BossPhase(1f, null),
                new BossPhase(0.7f, null)
            };

            Assert.That(selector.SelectPhase(phases, 0.8f), Is.EqualTo(2));
        }

        [Test]
        public void SelectPhase_ThresholdIsInclusive()
        {
            List<BossPhase> phases = new List<BossPhase>
            {
                new BossPhase(0.5f, null),
                new BossPhase(1f, null)
            };

            Assert.That(selector.SelectPhase(phases, 0.5f), Is.EqualTo(0));
        }

        [Test]
        public void SelectPhase_ReturnsMinusOneWhenNoPhaseIsEligible()
        {
            List<BossPhase> phases = new List<BossPhase>
            {
                new BossPhase(0.75f, null),
                new BossPhase(1f, null)
            };

            Assert.That(selector.SelectPhase(phases, 0.5f), Is.EqualTo(-1));
        }

        [Test]
        public void SelectPhase_ReturnsMinusOneForNullOrEmptySet()
        {
            Assert.That(selector.SelectPhase(null, 1f), Is.EqualTo(-1));
            Assert.That(selector.SelectPhase(new List<BossPhase>(), 1f), Is.EqualTo(-1));
        }

        [Test]
        public void SelectPhase_IgnoresNullEntries()
        {
            List<BossPhase> phases = new List<BossPhase>
            {
                null,
                new BossPhase(0.5f, null)
            };

            Assert.That(selector.SelectPhase(phases, 0.75f), Is.EqualTo(1));
        }
    }
}