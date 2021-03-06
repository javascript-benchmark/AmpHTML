// Comparators for calling standard algorithms on various containers.

#ifndef HTMLPARSER__COMPARATORS_H_
#define HTMLPARSER__COMPARATORS_H_

#include <utility>

namespace htmlparser {

// Comparator for performining binary search on list/array of std::pair(s).
template <typename K, typename V>
struct PairComparator {
  bool operator()(const std::pair<K, V>& left,
                  const K& right) const {
    return left.first < right;
  }

  bool operator()(const K& left,
                  const std::pair<K, V>& right) const {
    return left < right.first;
  }
};

}  // namespace htmlparser

#endif  // HTMLPARSER__COMPARATORS_H_
